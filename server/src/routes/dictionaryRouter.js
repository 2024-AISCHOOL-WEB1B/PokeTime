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
      console.log("조회성공");
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
  const { name } = req.query;
  const { img } = req.query;

  // 진화된 포켓몬이 이미 있는지 확인
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
      SELECT poke_img, poke_type,poke_name
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
          const name = rows[0].poke_name;
          let evlsql = `
          INSERT into user_poke_info (poke_name, user_id, user_poke_img) values(?, ?, ?)
          `;
          conn.query(evlsql, [name, id, img], (err, rows) => {
            if (err) {
              console.log("진화 실패", err);
              res.status(500).json({ result: "진화 실패", error: err.message });
            }
            if (rows) {
              console.log(img, type, name);
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

router.post("/levelup", (req, res) => {
  let id = req.session.userInfo.user_id;
  const { img } = req.body;

  // 트랜잭션 시작
  conn.beginTransaction((err) => {
    if (err) {
      console.log("트랜잭션 시작 오류", err);
      return res.status(500).json({ result: "트랜잭션 시작 오류" });
    }

    // 현재 레벨 및 유저 포인트 확인 쿼리
    let checkLevelAndPointSql = `
    SELECT u.user_point, p.user_poke_lv
    FROM user_info u
    JOIN user_poke_info p ON u.user_id = p.user_id
    WHERE u.user_id = ? AND p.user_poke_img = ?
    `;

    conn.query(checkLevelAndPointSql, [id, img], (err, rows) => {
      if (err) {
        return conn.rollback(() => {
          console.log("레벨 및 포인트 확인 중 오류 발생", err);
          res.status(500).json({ result: "레벨 및 포인트 확인 중 오류 발생" });
        });
      }

      if (rows.length === 0) {
        return conn.rollback(() => {
          res.status(404).json({ result: "포켓몬을 찾을 수 없습니다" });
        });
      }

      const currentLevel = rows[0].user_poke_lv;
      const userPoint = rows[0].user_point;
      const maxLevel = 3; // 최대 레벨 설정
      const requiredPoint = 100; // 레벨업에 필요한 포인트

      if (currentLevel >= maxLevel) {
        return conn.rollback(() => {
          res.json({ result: "이미 최대 레벨입니다" });
        });
      }

      if (userPoint < requiredPoint) {
        return conn.rollback(() => {
          res.json({ result: "포인트가 부족합니다" });
        });
      }

      // 레벨업 쿼리
      let levelUpSql = `
      UPDATE user_poke_info 
      SET user_poke_exp = user_poke_exp + 100, user_poke_lv = user_poke_lv + 1
      WHERE user_id = ? AND user_poke_img = ?
      `;

      conn.query(levelUpSql, [id, img], (err, result) => {
        if (err) {
          return conn.rollback(() => {
            console.log("레벨업 쿼리 실행 중 오류 발생", err);
            res.status(500).json({ result: "레벨업 쿼리 실행 중 오류 발생" });
          });
        }

        // 포인트 차감 쿼리
        let pointSql = `
        UPDATE user_info SET user_point = user_point - ?
        WHERE user_id = ?
        `;

        conn.query(pointSql, [requiredPoint, id], (err, result) => {
          if (err) {
            return conn.rollback(() => {
              console.log("포인트 차감 중 오류 발생", err);
              res.status(500).json({ result: "포인트 차감 중 오류 발생" });
            });
          }

          // 포인트 로그 쿼리
          let pointLogSql = `
          INSERT INTO user_point_log(user_id, point_log_name, point_log_date, point_log) 
          VALUES (?, ?, NOW(), ?)
          `;

          conn.query(
            pointLogSql,
            [id, "레벨업", `-${requiredPoint}`],
            (err, result) => {
              if (err) {
                return conn.rollback(() => {
                  console.log("포인트 로그 실패", err);
                  res
                    .status(500)
                    .json({ result: "포인트 로그 실패", error: err.message });
                });
              }

              // 모든 쿼리가 성공적으로 실행되었다면 트랜잭션 커밋
              conn.commit((err) => {
                if (err) {
                  return conn.rollback(() => {
                    console.log("커밋 실패", err);
                    res.status(500).json({ result: "커밋 실패" });
                  });
                }
                console.log("레벨업 및 포인트 차감 성공!");
                res.json({
                  result: "레벨업 성공",
                  newLevel: currentLevel + 1,
                });
              });
            }
          );
        });
      });
    });
  });
});

module.exports = router;
