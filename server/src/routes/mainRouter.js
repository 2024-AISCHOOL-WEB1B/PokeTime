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

// 사용자가 포켓몬 뽑기 페이지를 요청했을 때
router.get("/pickuppoke", (req, res) => {
  if (req.session.pickuppoke) {
    res.render("pickuppoke", { pickuppoke: req.session.pickuppoke });
  } else {
    res.redirect("/pickuppoke");
  }
});

// 사용자가 관리 페이지를 요청했을 때
router.get("/management", (req, res) => {
  res.render("management");
});

// 사용자가 스케쥴러 페이지를 요청했을 때
router.get("/scheduler", (req, res) => {
  res.render("scheduler");
});

router.get("/setting", (req, res) => {
  res.render("setting");
});

module.exports = router;
