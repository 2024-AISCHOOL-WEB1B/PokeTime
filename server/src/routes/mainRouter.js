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
    // console.log(req.session.userInfo);
  } else {
    res.redirect("/login"); // 로그인 페이지로 리다이렉트
  }
});

// 사용자가 포켓몬 뽑기 페이지를 요청했을 때
router.get("/pickuppoke", (req, res) => {
  res.render("pickuppoke", { pickuppoke: req.session.pickuppoke || {} });
});

// 사용자가 관리 페이지를 요청했을 때
router.get("/management", (req, res) => {
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

module.exports = router;
