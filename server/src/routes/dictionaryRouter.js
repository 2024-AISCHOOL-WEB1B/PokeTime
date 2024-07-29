const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 도감 조회
router.get("/info", (req, res) => {
  let id = req.session.userInfo.user_id;
  let sql = `
  SELECT a.*, b.*
  FROM poke_info a
  LEFT JOIN user_poke_info b ON a.poke_name = b.poke_name
  WHERE b.user_id = ?
  `;
  conn.query(sql, [id], (err, rows) => {
    if (err) {
      console.log("도감 조회 실패", err);
      res.status(500).json({ result: "조회실패", error: err.message });
    }
    if (rows) {
      console.log("조회성공", rows);
      res.json({ result: "조회성공", rows: rows });
    }
  });
});

// 도감 검색
router.get("/search", (req, res) => {
  let search = req.query;
  let sql = `
  SELECT a.*, b*
  FROM poke_info a
  LEFT JOIN user_poke_info b ON a.poke_name = b.poke_nale
  WHERE a.poke_name = ?
  `;
  conn.query(sql, [search], (err, rows) => {
    if (err) {
      console.log("검색 실패", err);
      res.status(500).json({ result: "검색실패", error: err.message });
    }
    if (rows) {
      console.log("검색 성공", rows);
      res.json({ result: "검색성공", rows: rows });
    }
  });
});

// 대표 포켓몬 설정
router.post("/mainpoke", (req, res) => {
  const { pokenum } = req.body;
  let sql = `
  SELECT poke_img
  FROM poke_info
  WHERE poke_num = ?
  `;
  conn.query(sql, [pokenum], (err, rows) => {
    let id = req.session.userInfo.user_id;
    let img = rows[0].poke_img;
    let mainpokeupdatesql = `
    UPDATE user_info set user_mainpoke_img = ? 
    WHERE user_id = ?
    `;
    conn.query(mainpokeupdatesql, [img, id], (err, rows) => {
      if (err) {
        console.log("메인 포켓몬 변경 실패", err);
        res
          .status(500)
          .json({ result: "메인 포켓몬 변경 실패", error: err.message });
      }
      if (rows) {
        console.log("메인 포켓몬 변경 성공", rows);
        res.json({ result: "메인 포켓몬 변경 성공", rows: rows });
      }
    });
  });
});

// 포켓몬 진화
router.get("/evolution", (req, res) => {
  let id = req.session.userInfo.user_id;
  const { name } = req.body;
  const { img } = req.body;
  let sql = `
  UPDATE user_poke_info set user_poke_lv = user_poke_lv + 1
  WHERE user_id = ? and user_poke_img = ?
  `;
  conn.query(sql, [id, img], (err, rows) => {
    if (err) {
      console.log("진화 실패", err);
      res.status(500).json({ result: "진화 실패", error: err.message });
    }
    if (rows) {
      console.log("진화 성공");
      let search_evl_poke_sql = `
      SELECT poke_img, poke_type
      FROM poke_info
      WHERE poke_name = ?
      `;
      conn.query(search_evl_poke_sql, [name], (err, rows) => {
        if (err) {
          console.log("진화 실패", err);
          res.status(500).json({ result: "진화 실패", error: err.message });
        }
        if (rows) {
          const img = rows[0].poke_img;
          const type = rows[0].poke_type;
          let evlsql = `
          INSERT into user_poke_info (poke_name, user_id, user_poke_img) values(?, ?, ?)
          `;
          conn.query(evlsql, [name, id, img], (err, rows) => {
            if (err) {
              console.log("진화 실패", err);
              res.status(500).json({ result: "진화 실패", error: err.message });
            }
            if (rows) {
              console.log("진화 성공");
              res.json({
                result: "진화성공",
                rows: { img: img, type: type, name: name },
              });
            }
          });
        }
      });
    }
  });
});

// 포켓몬 레벨업
router.post("/levelup", (req, res) => {
  let id = req.session.userInfo.user_id;
  const { img } = req.body;
  let sql = `
  UPDATE user_poke_info set user_poke_exp = user_poke_exp + 100, user_poke_lv = user_poke_lv + 1
  WHERE user_id = ? and user_poke_img = ?
  `;
  conn.query(sql, [id, img], (err, rows) => {
    if (err) {
      console.log("쿼리 실행 중 오류 발생");
      res.json({ result: "쿼리 실행 중 오류 발생" });
    }
    if (rows) {
      let pointsql = `
      UPDATE user_info set user_point = user_point - 100
      WHERE user_id = ?
      `;
      conn.query(pointsql, [id], (err, rows) => {
        if (err) {
          console.log("쿼리 실행 중 오류 발생");
          res.json({ result: "쿼리 실행 중 오류 발생" });
        }
        if (rows) {
          console.log("포인트 차감 성공!");
          res.json({ result: "포인트 차감 성공" });
          let pointlogsql = `insert into user_point_log(user_id, point_log_name, point_log_date, point_log) values (?, ?,now(), ?)`;
          conn.query(pointlogsql, [id, "레벨업", "-100"], (err, rows) => {
            if (err) {
              console.log("포인트 로그 실패", err);
              res
                .status(500)
                .json({ result: "포인트로그실패", error: err.message });
            }
            if (rows) {
              console.log("포인트 로그 성공", rows);
              res.json({ result: "포인트로그성공" });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
