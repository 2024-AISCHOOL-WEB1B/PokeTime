const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 회원가입
router.post("/join", (req, res) => {
  let { email, pw, nick } = req.body;
  let sql =
    "insert into user_info (user_id, user_pw, user_nick) values (?, ?, ?)";
  conn.query(sql, [email, pw, nick], (err, rows) => {
    if (err) {
      console.error("가입 실패", err);
      res.status(500).json({ result: "가입실패", error: err.message });
    }
    if (rows) {
      // res.redirect("/login");
      console.log("성공", rows);
      res.json({ result: "가입성공" });
    } else {
      console.log("가입 성공", rows);
      res.json({ result: "가입성공" });
    }
  });
});

// 로그인
router.post("/login", (req, res) => {
  let { userEmail, userPw } = req.body;
  let sql = `
    SELECT a.user_id, b.user_poke_date, b.poke_name, b.user_poke_img, a.user_pickup_cnt, a.user_point, b.user_poke_exp
    FROM user_info a
    LEFT JOIN user_poke_info b ON a.user_id = b.user_id AND a.user_mainpoke_img = b.user_poke_img
    WHERE a.user_id = ? AND a.user_pw = ?
`;
  conn.query(sql, [userEmail, userPw], (err, rows) => {
    if (err) {
      console.error("쿼리 실행 중 오류 발생:", err);
      return res.status(500).json({ result: "서버 오류" });
    }

    if (rows.length > 0) {
      console.log("rows", rows);
      const userInfo = {
        user_id: rows[0].user_id,
        with_date: rows[0].user_poke_date,
        main_poke: rows[0].poke_name,
        poke_img: rows[0].user_poke_img,
        pickup_cnt: rows[0].user_pickup_cnt,
        point: rows[0].user_point,
        exp: rows[0].user_poke_exp,
      };

      // 포켓몬 수 조회 쿼리 추가
      let pokemonCountSql =
        "SELECT COUNT(*) as poke_count FROM user_poke_info WHERE user_id = ?";
      conn.query(pokemonCountSql, [userEmail], (countErr, countResult) => {
        if (countErr) {
          console.error("포켓몬 수 조회 중 오류 발생:", countErr);
          return res.status(500).json({ result: "서버 오류" });
        }

        userInfo.poke_count = countResult[0].poke_count;

        req.session.userInfo = userInfo;
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("세션 저장 오류:", saveErr);
            return res.status(500).json({ result: "서버 오류" });
          }
          console.log("로그인 성공, 세션 저장됨:", req.session);
          res.json({ result: "로그인성공" });
        });
      });
    } else {
      console.log("로그인 실패");
      res.json({ result: "로그인실패" });
    }
  });
});

// 회원정보 수정
router.post("/update", (req, res) => {
  let { nick, pw } = req.body;
  let id = req.session.userInfo.user_id;

  // 입력된 값에 따라 동적으로 쿼리를 생성
  let fields = [];
  let values = [];

  if (nick) {
    fields.push("user_nick = ?");
    values.push(nick);
  }
  if (pw) {
    fields.push("user_pw = ?");
    values.push(pw);
  }
  values.push(id);

  // 동적으로 쿼리를 생성
  let sql = `UPDATE user_info SET ${fields.join(", ")} WHERE user_id = ?`;

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error("쿼리 실행 중 오류 발생:", err);
      return res.status(500).json({ result: "서버 오류" });
    } else {
      console.log("수정완료");
      res.json({ result: "수정완료" });
    }
  });
});

// 회원 탈퇴
router.post("/delete", (req, res) => {
  let id = req.session.userInfo.user_id;
  let sql = "delete from user_info where user_id = ?";
  conn.query(sql, [id], (err, rows) => {
    if (rows.affectedRows > 0) {
      console.log("삭제 성공");
      res.json({ result: "삭제 성공" });
    } else {
      console.log("삭제 실패! 아이디 비번이 다릅니다!");
      res.json({ result: "삭제 실패" });
    }
  });
});

// 로그아웃
router.get("/logout", (req, res) => {
  if (req.session.userInfo) {
    delete req.session.userInfo; // 세션에서 사용자 정보만 삭제
    console.log("로그아웃 성공");
    console.log(req.session.userInfo);
    res.redirect("/");
    res.json({ result: "삭제 성공" });
  } else {
    res.redirect("/");
  }
});

// 포켓몬 뽑기
router.post("/pickuppoke", (req, res) => {
  let id = req.session.userInfo.user_id;
  let sql = `
    SELECT a.*
    FROM poke_info a
    LEFT JOIN user_poke_info b ON a.poke_name = b.poke_name
    WHERE a.poke_name NOT IN (SELECT poke_name FROM user_poke_info WHERE user_id = ?) and a.poke_init = 1
  `;

  conn.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("쿼리 실행 중 오류 발생:", err);
      return res.status(500).json({ result: "서버 오류" });
    }

    if (rows.length > 0) {
      const randomIndex = Math.floor(Math.random() * rows.length);
      const selectedPoke = rows[randomIndex];

      const pickuppoke = {
        pickup_result: selectedPoke.poke_name,
        poke_img: selectedPoke.poke_img,
      };

      console.log(pickuppoke);
      req.session.pickuppoke = pickuppoke;

      let inputpokesql = `
        INSERT INTO user_poke_info
        (poke_name, user_id, user_poke_img)
        VALUES (?, ?, ?)
      `;

      conn.query(
        inputpokesql,
        [pickuppoke.pickup_result, id, pickuppoke.poke_img],
        (err, result) => {
          if (err) {
            console.error("쿼리 실행 중 오류 발생:", err);
            return res.status(500).json({ result: "서버 오류" });
          }

          // user_info 테이블의 user_pickup_cnt 증가
          let updatePickupCntSql = `
            UPDATE user_info
            SET user_pickup_cnt = user_pickup_cnt + 1
            WHERE user_id = ?
          `;

          conn.query(updatePickupCntSql, [id], (err, updateResult) => {
            if (err) {
              console.error("pickup_cnt 업데이트 중 오류 발생:", err);
              return res.status(500).json({ result: "서버 오류" });
            }

            req.session.save((err) => {
              if (err) {
                console.error("세션 저장 오류:", err);
                return res.status(500).json({ result: "서버 오류" });
              }
              console.log("뽑기 성공, 세션 저장됨:", req.session);
              console.log("뽑은 포켓몬 값 DB 저장 완료");
              console.log("user_pickup_cnt 증가 완료");
              res.json({ result: "뽑기성공", pickuppoke });
            });
          });
        }
      );
    } else {
      console.log("뽑기 실패");
      res.json({ result: "뽑기실패" });
    }
  });
});

// 스케줄러
router.post("/scheduler", (req, res) => {
  console.log("Session in scheduler:", req.session.userInfo);

  if (!req.session.userInfo) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  let { todo } = req.body;
  let id = req.session.userInfo.user_id;
  let today = new Date();
  let schedule_date = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식

  let sql =
    "INSERT INTO scheduler (user_id, schedule_name, schedule_date) VALUES (?, ?, ?)";
  conn.query(sql, [id, todo, schedule_date], (err, result) => {
    if (err) {
      console.error("SQL 오류:", err);
      return res.status(500).json({ error: "데이터베이스 오류" });
    }
    console.log("삽입된 행:", result);
    res.json({ message: "일정이 저장되었습니다." });
  });
});

module.exports = router;
