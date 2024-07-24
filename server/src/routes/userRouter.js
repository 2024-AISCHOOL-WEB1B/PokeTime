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
    SELECT a.user_id, b.user_poke_date, b.poke_name, b.user_mainpoke_img, a.user_pickup_cnt
    FROM user_info a
    LEFT JOIN user_poke_info b ON a.user_id = b.user_id
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
        poke_img: rows[0].user_mainpoke_img,
        pickup_cnt: rows[0].user_pickup_cnt,
      };

      req.session.userInfo = userInfo;
      req.session.save((err) => {
        if (err) {
          console.error("세션 저장 오류:", err);
          return res.status(500).json({ result: "서버 오류" });
        }
        console.log("로그인 성공, 세션 저장됨:", req.session);
        res.json({ result: "로그인성공" });
      });
    } else {
      console.log("로그인 실패");
      res.json({ result: "로그인실패" });
    }
  });
});

// 회원정보 수정
router.post("/update", (req, res) => {
  let { id, pw, nick } = req.body;
});

// 회원 탈퇴
router.post("/delete", (req, res) => {
  let { id, pw } = req.body;
  let sql = "delete from user_info where user_id = ? and user_pw = ?";
  conn.query(sql, [id, pw], (err, rows) => {
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
  // if (req.session.user) {
  //   delete req.session.user; // 세션에서 사용자 정보만 삭제
  //   console.log("로그아웃 성공");
  //   console.log(req.session.user);
  // }
  res.redirect("/");
});

// 포켓몬 뽑기
router.post("/pickuppoke", (req, res) => {
  let sql = `
    SELECT a.*
    FROM poke_info a
    LEFT JOIN user_poke_info b ON a.poke_name = b.poke_name
    WHERE a.poke_name NOT IN (SELECT poke_name FROM user_poke_info)
  `;

  conn.query(sql, (err, rows) => {
    if (err) {
      console.error("쿼리 실행 중 오류 발생:", err);
      return res.status(500).json({ result: "서버 오류" });
    }

    if (rows.length > 0) {
      // 랜덤으로 하나의 포켓몬을 선택
      const randomIndex = Math.floor(Math.random() * rows.length);
      const selectedPoke = rows[randomIndex];

      const pickuppoke = {
        pickup_result: selectedPoke.poke_name,
        poke_img: selectedPoke.poke_img,
      };

      req.session.pickuppoke = pickuppoke;

      console.log("뽑기 성공:", pickuppoke);
      res.json({ result: "뽑기성공", pickuppoke });
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
