const express = require("express");
const router = express.Router();

// 사용자가 메인 페이지에 도착했을 때
router.get("/", (req, res) => {
  res.render("main");
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
router.get("/mainpage", (req, res) => {});

module.exports = router;
