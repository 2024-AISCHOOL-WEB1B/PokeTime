const express = require("express");
const router = express.Router();

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
  if (req.session.userInfo) {
    res.render("mainpage", { userInfo: req.session.userInfo });
  } else {
    res.redirect("/login"); // 로그인 페이지로 리다이렉트
  }
});

module.exports = router;
