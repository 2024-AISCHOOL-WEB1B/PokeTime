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

// 출석 라우터
router.post("/attend", (req, res) => {
  let id = req.session.userInfo.user_id;

  conn.beginTransaction((err) => {
    if (err) {
      console.error("트랜잭션 시작 오류:", err);
      return res.status(500).json({ result: "서버 오류" });
    }

    // 마지막 출석일자 조회
    conn.query(
      "SELECT attend_cnt, check_date FROM Attend_info WHERE user_id = ? ORDER BY check_date DESC LIMIT 1",
      [id],
      (err, lastAttend) => {
        if (err) {
          return conn.rollback(() => {
            console.error("출석 조회 오류:", err);
            res.status(500).json({ result: "서버 오류" });
          });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendCnt = 1;
        let pointToAdd = 5;

        if (lastAttend.length > 0) {
          const lastDate = new Date(lastAttend[0].check_date);
          lastDate.setHours(0, 0, 0, 0);

          const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);

          if (diffDays === 1) {
            // 연속 출석
            attendCnt = lastAttend[0].attend_cnt + 1;
            if (attendCnt % 7 === 0) {
              pointToAdd = 10;
            }
          } else if (diffDays === 0) {
            // 이미 오늘 출석함
            return conn.rollback(() => {
              res.json({ result: "이미 출석하셨습니다." });
            });
          } else {
            attendCnt = 1;
          }
        }

        const updateAttendance = () => {
          // 출석 정보 업데이트
          conn.query(
            "UPDATE Attend_info set attend_cnt = ?, check_date = CURDATE() WHERE user_id = ?",
            [attendCnt, id],
            (err) => {
              if (err) {
                return conn.rollback(() => {
                  console.error("출석 업데이트 오류:", err);
                  res.status(500).json({ result: "서버 오류" });
                });
              }

              // 포인트 증가
              conn.query(
                "UPDATE user_info SET user_point = user_point + ? WHERE user_id = ?",
                [pointToAdd, id],
                (err) => {
                  if (err) {
                    return conn.rollback(() => {
                      console.error("포인트 업데이트 오류:", err);
                      res.status(500).json({ result: "서버 오류" });
                    });
                  }

                  // 포인트 로그 저장
                  conn.query(
                    "INSERT INTO user_point_log(user_id, point_log_name, point_log_date, point_log) VALUES (?, '출석', NOW(), ?)",
                    [id, `+${pointToAdd}`],
                    (err) => {
                      if (err) {
                        return conn.rollback(() => {
                          console.error("포인트 로그 저장 오류:", err);
                          res.status(500).json({ result: "서버 오류" });
                        });
                      }

                      conn.commit((err) => {
                        if (err) {
                          return conn.rollback(() => {
                            console.error("커밋 오류:", err);
                            res.status(500).json({ result: "서버 오류" });
                          });
                        }
                        res.json({
                          result: "출석 성공",
                          pointsEarned: pointToAdd,
                          attendanceStreak: attendCnt,
                        });
                      });
                    }
                  );
                }
              );
            }
          );
        };

        // 신규 사용자 처리
        if (lastAttend.length === 0) {
          conn.query(
            "INSERT INTO Attend_info (user_id, attend_cnt, check_date) VALUES (?, 1, CURDATE())",
            [id],
            (err) => {
              if (err) {
                return conn.rollback(() => {
                  console.error("신규 사용자 출석 정보 저장 오류:", err);
                  res.status(500).json({ result: "서버 오류" });
                });
              }
              updateAttendance();
            }
          );
        } else {
          updateAttendance();
        }
      }
    );
  });
});

// 포인트 로그 조회
router.get("/log", (req, res) => {
  let id = req.session.userInfo.user_id;
  let sql =
    "select * from user_point_log where user_id = ? order by point_log_num desc";
  conn.query(sql, [id], (err, rows) => {
    if (rows) {
      console.log("포인트 로그 조회 성공", rows);
      res.json({ rows: rows });
    }
    if (err) {
      console.log("포인트 로그 조회 실패", err);
      res
        .status(500)
        .json({ result: "포인트로그조회실패", error: err.message });
    }
  });
});
// 포인트 조회
router.get("/search", (req, res) => {
  let id = req.session.userInfo.user_id;
  let sql = " select user_point from user_info where user_id = ?";
  conn.query(sql, [id], (err, rows) => {
    if (rows) {
      res.json({ rows: rows });
    }
    if (err) {
      console.log("포인트 조회 실패", err);
      res.status(500).json({ result: "포인트조회실패", error: err.message });
    }
  });
});

module.exports = router;
