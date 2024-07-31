const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 사용자가 메인 페이지에 도착했을 때
router.get("/", (req, res) => {
  res.render("index");
});

// 사용자가 로그인을 요청했을 때 로그인 페이지 렌더링
router.get("/login", (req, res) => {
  res.render("login");
});

// 사용자가 회원가입을 요청했을 때
router.get("/join", (req, res) => {
  res.render("sign_up");
});

// 사용자가 메인 페이지를 요청했을 때
router.get("/mainpage", (req, res) => {
  let id = req.session.userInfo.user_id;
  let sql = `
    SELECT b.user_poke_date, b.poke_name, b.user_poke_img, a.user_pickup_cnt, a.user_point, b.user_poke_exp
    FROM user_info a
    LEFT JOIN user_poke_info b ON a.user_id = b.user_id AND a.user_mainpoke_img = b.user_poke_img
    WHERE a.user_id = ?
  `;
  conn.query(sql, [id], (err, userinforows) => {
    if (userinforows) {
      const userinfo = {
        with_date: userinforows[0].user_poke_date,
        main_poke: userinforows[0].poke_name,
        poke_img: userinforows[0].user_poke_img,
        pickup_cnt: userinforows[0].user_pickup_cnt,
        point: userinforows[0].user_point,
        exp: userinforows[0].user_poke_exp,
      };

      let pokemonCountSql =
        "SELECT COUNT(*) as poke_count FROM user_poke_info WHERE user_id = ?";
      conn.query(pokemonCountSql, [id], (err, countpokerows) => {
        if (countpokerows) {
          userinfo.poke_count = countpokerows[0].poke_count;
          res.render("mainpage", { userinforows: userinfo });
        } else {
          res.render("login");
        }
      });
    }
  });
});

// 사용자가 포켓몬 뽑기 페이지를 요청했을 때
router.get("/pickuppoke", (req, res) => {
  res.render("pickuppoke", { pickuppoke: req.session.pickuppoke || {} });
});

// 사용자가 관리 페이지를 요청했을 때
router.get("/management", (req, res) => {
  // console.log(req.session);
  res.render("management");
});

// 사용자가 스케쥴러 페이지를 요청했을 때
router.get("/scheduler", (req, res) => {
  res.render("scheduler");
});

// 사용자가 회원정보 수정을 요청했을 때
router.get("/setting", (req, res) => {
  res.render("setting");
});

// 사용자가 도감 페이지를 요철했을 때
router.get("/dictionary", (req, res) => {
  res.render("dictionary", { userInfo: req.session.userInfo });
});

// 사용자가 로그 페이지 요청했을 때
router.get("/log", (req, res) => {
  res.render("log");
});

// 알림
router.post("/notification", (req, res) => {
  let id = req.session.userInfo.user_id;
  const sql = `select user_point from user_info where user_id = ?`;
  console.log("알림", id);
  conn.query(sql, [id], (err, rows) => {
    if (err) {
      console.log("알림 실패", err);
      res.status(500).json({ result: "알림실패", error: err.message });
    }
    if (rows) {
      console.log("알림 성공", rows);
      res.json({ rows: rows });
    }
  });
});

module.exports = router;
