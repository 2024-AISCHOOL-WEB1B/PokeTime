const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 사진 찍었을 때 경험치 획득
router.post("/picture", (req, res) => {
  let id = req.session.userInfo.user_id;
  let sql =
    "update user_info set user_point = user_point + 10 where user_id = ?";
  conn.query(sql, [id], (err, rows) => {
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
    "insert into user_point_log(user_id, point_log_name, point_log_date, point_log) values (?, ?,now(), ?)";
  conn.query(sql2, [id, "먹이 주기", "+10"], (err, rows) => {
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
router.post("/attend", (req, res) => {
  let id = req.session.userInfo.user_id;
  let sql = "call checkAttendance(?)";
  let sql2 = "select * from Attend_info where user_id = ?";
  // 기본 출석 5, attend_cnt가 7의 배수일 때 10
  let sql3 =
    "update user_info set user_point = user_point + ? where user_id = ?";
  let sql4 =
    "insert into user_point_log(user_id, point_log_name, point_log_date, point_log) values (?, ?,now(), ?)";

  conn.query(sql, [id], (err, rows) => {
    if (err) {
      console.log("출석 실패", err);
      res.status(500).json({ result: "출석실패", error: err.message });
    }
    if (rows) {
      console.log("출석 성공", rows);
      conn.query(sql2, [id], (err, rows) => {
        if (rows) {
          let attend_cnt = rows[0].attend_cnt;
          if (attend_cnt % 7 == 0) {
            conn.query(sql3, [10, id], (err, rows) => {
              if (rows) {
                console.log("포인트 증가 성공", rows);
                res.json({ attend: "출석성공", point: "포인트증가성공" });
                conn.query(sql4, [id, "출석", "+10"], (err, rows) => {
                  if (rows) {
                    console.log("포인트 로그 성공", rows);
                    res.json({ result: "포인트로그성공" });
                  }
                  if (err) {
                    console.log("포인트 로그 실패", err);
                    res
                      .status(500)
                      .json({ result: "포인트로그실패", error: err.message });
                  }
                });
              }
              if (err) {
                console.log("포인트 증가 실패", err);
                res
                  .status(500)
                  .json({ result: "포인트증가실패", error: err.message });
              }
            });
          }
          if (attend_cnt % 7 != 0) {
            conn.query(sql3, [5, id], (err, rows) => {
              if (rows) {
                console.log("포인트 증가 성공", rows);
                res.json({ attend: "출석성공", point: "포인트증가성공" });
                conn.query(sql4, [id, "출석", "+5"], (err, rows) => {
                  if (rows) {
                    console.log("포인트 로그 성공", rows);
                    res.json({ result: "포인트로그성공" });
                  }
                  if (err) {
                    console.log("포인트 로그 실패", err);
                    res
                      .status(500)
                      .json({ result: "포인트로그실패", error: err.message });
                  }
                });
              }
              if (err) {
                console.log("포인트 증가 실패", err);
                res
                  .status(500)
                  .json({ result: "포인트증가실패", error: err.message });
              }
            });
          }
        }
      });
    }
  });
});

// 포인트 로그 조회
router.post("/log", (req, res) => {
  let id = req.session.userInfo.user_id;
  let sql = "select * from user_point_log where user_id = ?";
  conn.query(sql, [id], (err, rows) => {
    if (rows) {
      console.log("포인트 로그 조회 성공", rows);
      res.json({ result: "포인트로그조회성공", rows: rows });
    }
    if (err) {
      console.log("포인트 로그 조회 실패", err);
      res
        .status(500)
        .json({ result: "포인트로그조회실패", error: err.message });
    }
  });
});

module.exports = router;
