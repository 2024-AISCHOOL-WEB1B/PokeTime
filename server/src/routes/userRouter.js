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
    }
  });
});

// 로그인
router.post("/login", (req, res) => {
  let { userEmail, userPw } = req.body;
  let sql = `
    SELECT user_id
    FROM user_info 
    WHERE user_id = ? AND user_pw = ?
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
      };

      req.session.userInfo = userInfo;
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("세션 저장 오류:", saveErr);
          return res.status(500).json({ result: "서버 오류" });
        }
        console.log("로그인 성공, 세션 저장됨:", req.session);
        res.json({ result: "로그인성공", rows: rows });
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
  let { pw } = req.body;
  console.log(id, pw);
  let sql = "delete from user_info where user_id = ? and user_pw = ?";
  // 포켓몬 삭제 쿼리
  let deletepoke = "delete from user_poke_info where user_id = ?";
  conn.query(sql, [id, pw], (err, rows) => {
    if (rows.affectedRows > 0) {
      console.log("탈퇴 성공");
      conn.query(deletepoke, [id], (err, rows) => {
        if (rows.affectedRows > 0) {
          console.log("포켓몬 삭제 성공");
          res.redirect("/");
        }
      });
    } else {
      console.log("탈퇴 실패");
      res.json({ result: "탈퇴실패" });
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
  } else {
    res.redirect("/");
  }
});

// 포켓몬 뽑기
router.post("/pickuppoke", (req, res) => {
  let id = req.session.userInfo.user_id;

  // 트랜잭션 시작
  conn.beginTransaction((err) => {
    if (err) {
      console.error("트랜잭션 시작 오류:", err);
      return res.status(500).json({ result: "서버 오류" });
    }

    // 먼저 유저의 포인트를 확인
    let checkPointSql = "SELECT user_point FROM user_info WHERE user_id = ?";
    conn.query(checkPointSql, [id], (err, pointResult) => {
      if (err) {
        return conn.rollback(() => {
          console.error("포인트 확인 중 오류 발생:", err);
          res.status(500).json({ result: "서버 오류" });
        });
      }

      if (pointResult[0].user_point < 100) {
        return conn.rollback(() => {
          res.json({ result: "포인트부족" });
        });
      }

      // 포인트가 충분하면 뽑기 진행
      let sql = `
        SELECT a.*
        FROM poke_info a
        LEFT JOIN user_poke_info b ON a.poke_name = b.poke_name
        WHERE a.poke_name NOT IN (SELECT poke_name FROM user_poke_info WHERE user_id = ?) and a.poke_init = 1
      `;

      conn.query(sql, [id], (err, rows) => {
        if (err) {
          return conn.rollback(() => {
            console.error("쿼리 실행 중 오류 발생:", err);
            res.status(500).json({ result: "서버 오류" });
          });
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
            (poke_name, user_id, user_poke_img, user_poke_date)
            VALUES (?, ?, ?, curdate())
          `;

          conn.query(
            inputpokesql,
            [pickuppoke.pickup_result, id, pickuppoke.poke_img],
            (err, result) => {
              if (err) {
                return conn.rollback(() => {
                  console.error("쿼리 실행 중 오류 발생:", err);
                  res.status(500).json({ result: "서버 오류" });
                });
              }

              // user_info 테이블의 user_pickup_cnt 증가 및 포인트 차감
              let updatePickupCntSql = `
                UPDATE user_info
                SET user_pickup_cnt = user_pickup_cnt + 1, user_point = user_point - 100
                WHERE user_id = ?
              `;

              conn.query(updatePickupCntSql, [id], (err, updateResult) => {
                if (err) {
                  return conn.rollback(() => {
                    console.error("pickup_cnt 업데이트 중 오류 발생:", err);
                    res.status(500).json({ result: "서버 오류" });
                  });
                }

                conn.commit((err) => {
                  if (err) {
                    return conn.rollback(() => {
                      console.error("커밋 중 오류 발생:", err);
                      res.status(500).json({ result: "서버 오류" });
                    });
                  }

                  req.session.save((err) => {
                    if (err) {
                      console.error("세션 저장 오류:", err);
                      return res.status(500).json({ result: "서버 오류" });
                    }

                    console.log("뽑기 성공, 세션 저장됨:", req.session);
                    console.log("뽑은 포켓몬 값 DB 저장 완료");
                    console.log("user_pickup_cnt 증가 및 포인트 차감 완료");
                    res.json({ result: "뽑기성공", pickuppoke });
                  });
                });
              });
            }
          );
        } else {
          conn.rollback(() => {
            console.log("뽑기 실패");
            res.json({ result: "뽑기실패" });
          });
        }
      });
    });
  });
});

// 스케줄러
router.post("/scheduler", (req, res) => {
  console.log("Session in scheduler:", req.session.userInfo);

  const { todo } = req.body;
  const id = req.session.userInfo.user_id;
  const today = new Date();
  const schedule_date = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식

  // 트랜잭션 시작
  conn.beginTransaction((err) => {
    if (err) {
      console.error("트랜잭션 시작 오류:", err);
      return res.json({ error: "트랜잭션 시작 오류" });
    }

    const sql =
      "INSERT INTO scheduler (user_id, schedule_name, schedule_date) VALUES (?, ?, ?)";
    conn.query(sql, [id, todo, schedule_date], (err, rows) => {
      if (err) {
        return conn.rollback(() => {
          console.error("스케쥴 삽입 SQL 오류:", err);
          return res.json({ error: "데이터베이스 오류" });
        });
      }

      const getpointsql =
        "UPDATE user_info SET user_point = user_point + 1 WHERE user_id = ?";
      conn.query(getpointsql, [id], (err, pointrows) => {
        if (err) {
          return conn.rollback(() => {
            console.error("포인트 적립 SQL 오류:", err);
            return res.json({ error: "데이터베이스 오류" });
          });
        }

        const pointlogsql =
          "INSERT into user_point_log(user_id, point_log_name, point_log_date, point_log) values (?, ?, now(), ?)";
        conn.query(
          pointlogsql,
          [id, "스케쥴 등록", "+1"],
          (err, pointlogrows) => {
            if (err) {
              return conn.rollback(() => {
                console.error("포인트 로그 삽입 실패", err);
                return res.json({ error: "데이터베이스 오류" });
              });
            }

            // 모든 쿼리가 성공적으로 실행되면 커밋
            conn.commit((err) => {
              if (err) {
                return conn.rollback(() => {
                  console.error("커밋 실패", err);
                  return res.json({ error: "데이터베이스 커밋 오류" });
                });
              }
              console.log("포인트 로그 성공");
              res.json({ result: "스케쥴 등록 성공" });
            });
          }
        );
      });
    });
  });
});

// 스케줄 조회
router.get("/searchscheduler", (req, res) => {
  let id = req.session.userInfo.user_id;
  let searchsql = "select * from scheduler where user_id = ?";
  conn.query(searchsql, [id], (err, rows) => {
    if (rows) {
      res.json({ rows: rows });
    }
    if (err) {
      console.log("스케쥴 조회 실패", err);
      res.status(500).json({ result: "스케쥴조회실패", error: err.message });
    }
  });
});

// 스케줄 삭제
router.delete("/scheduledelete", (req, res) => {
  let id = req.session.userInfo.user_id;
  let { schedule_name } = req.body;

  // 트랜잭션 시작
  conn.beginTransaction((err) => {
    if (err) {
      console.error("트랜잭션 시작 오류:", err);
      return res.status(500).json({ error: "트랜잭션 시작 오류" });
    }

    const sql = "DELETE FROM scheduler WHERE schedule_name = ? AND user_id = ?";
    conn.query(sql, [schedule_name, id], (err, rows) => {
      if (err) {
        return conn.rollback(() => {
          console.error("스케줄 삭제 실패:", err);
          return res.status(500).json({ error: "스케줄 삭제 실패" });
        });
      }

      if (rows.affectedRows === 0) {
        return conn.rollback(() => {
          console.log("삭제할 스케줄이 없습니다.");
          return res.status(404).json({ error: "삭제할 스케줄이 없습니다." });
        });
      }

      const pointremovesql =
        "UPDATE user_info SET user_point = user_point - 1 WHERE user_id = ?";
      conn.query(pointremovesql, [id], (err, pointremoverows) => {
        if (err) {
          return conn.rollback(() => {
            console.error("포인트 차감 중 오류 발생:", err);
            return res.status(500).json({ error: "포인트 차감 실패" });
          });
        }

        if (pointremoverows.affectedRows === 0) {
          return conn.rollback(() => {
            console.error("포인트 차감 실패: 해당 사용자를 찾을 수 없습니다.");
            return res.status(404).json({
              error: "포인트 차감 실패: 해당 사용자를 찾을 수 없습니다.",
            });
          });
        }

        const pointlogsql =
          "INSERT INTO user_point_log(user_id, point_log_name, point_log_date, point_log) VALUES (?, ?, NOW(), ?)";
        conn.query(
          pointlogsql,
          [id, "스케쥴 삭제", "-1"],
          (err, pointlogrows) => {
            if (err) {
              return conn.rollback(() => {
                console.error("포인트 로그 저장 실패:", err);
                return res.status(500).json({ error: "포인트 로그 저장 실패" });
              });
            }

            // 모든 작업이 성공적으로 완료되면 커밋
            conn.commit((err) => {
              if (err) {
                return conn.rollback(() => {
                  console.error("커밋 실패:", err);
                  return res.status(500).json({ error: "커밋 실패" });
                });
              }

              console.log(
                "스케쥴 삭제 및 포인트 차감 및 포인트 로그 저장 성공"
              );
              res.json({
                result: "스케쥴 삭제 및 포인트 차감 및 포인트 로그 저장 성공",
              });
            });
          }
        );
      });
    });
  });
});

module.exports = router;

// 출석일수 조회
router.get("/attendcount", (req, res) => {
  let id = req.session.userInfo.user_id;
  let sql = "select * from Attend_info where user_id = ?";
  conn.query(sql, [id], (err, rows) => {
    if (rows) {
      console.log("출석 횟수 조회 성공", rows);
      res.json({ rows: rows });
    }
    if (err) {
      console.log("출석 횟수 조회 실패", err);
      res.status(500).json({ result: "출석횟수조회실패", error: err.message });
    }
  });
});

module.exports = router;
