const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 회원가입
router.post("/join", (req, res) => {
  let { email, pw, pwck, nick } = req.body;
  let sql =
    "insert into user_info (user_id, user_pw, user_nick) values (?, ?, ?)";
  conn.query(sql, [email, pw, nick], (err, rows) => {
    // if (rows & (pw === pwck)) {
    //   // res.redirect("/login");
    //   console.log("성공", rows);
    //   res.json({ result: "가입성공" });
    // } else {
    //   // res.render("/");
    //   console.log("실패", rows);
    //   res.json({ result: "가입실패" });
    // }

    if (err) {
      console.error("가입 실패", err);
      res.status(500).json({ result: "가입실패", error: err.message });
    } else {
      console.log("가입 성공", rows);
      res.json({ result: "가입성공" });
    }
  });
});

// 로그인
router.post("/login", (req, res) => {
  let { id, pw } = req.body;
  let sql =
    "select user_id, user_pw from user_info where user_id = ? and user_pw = ?";
  conn.query(sql, [id, pw], (err, rows) => {
    if (rows.length > 0) {
      // res.redirect("/mainpage");
      console.log("로그인 성공");
      res.json({ result: "로그인성공" });
    } else {
      // res.render("/");
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
  req.session.destroy();
  res.redirect("/");
});

// 포켓몬 뽑기
router.post("/pickuppoke", (req, res) => {});

// 스케줄러
router.get("/scheduler", (req, res) => {});

module.exports = router;
