const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 사진 찍었을 때 경험치 획득
router.post("/picture", (req, res) => {
  let { point } = req.body;
  let id = req.session.userInfo.user_id;
  let sql =
    "update user_info set user_point = user_point + ? where user_id = ?";
  conn.query(sql, [point, id], (err, rows) => {
    if (err) {
      console.log("포인트 증가 실패", err);
      res.status(500).json({ result: "포인트증가실패", error: err.message });
    }
    if (rows) {
      console.log("포인트 증가 성공", rows);
      res.json({ result: "포인트증가성공" });
    }
  });
  let sql2 =
    "insert into user_point_log(user_id, point_log_date, point_log) values (?, now(), ?)";
  conn.query(sql2, [id, point], (err, rows) => {
    if (err) {
      console.log("포인트 로그 실패", err);
      res.status(500).json({ result: "포인트로그실패", error: err.message });
    }
    if (rows) {
      console.log("포인트 로그 성공", rows);
      res.json({ result: "포인트로그성공" });
    }
  });
});

// 출석 했을 때 경험치 획득
router.post("/attend", (req, res) => {});

// 포인트 로그 조회
router.post("/log", (req, res) => {});

module.exports = router;
