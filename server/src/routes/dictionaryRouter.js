const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 도감 조회
router.get("/info", (req, res) => {
  let { email, pw, nick } = req.body;
  let sql = "select poke_img from poke_info";
  conn.query(sql, [email], (err, rows) => {
    if (err) {
      console.err("도감 조회 실패", err);
      res.status(500).json({ result: "조회실패", error: err.message });
    }
    if (rows) {
      console.log("조회성공", rows);
      res.json({ result: "조회성공" });
    }
  });
});

// 도감 색인
router.get("/index", (req, res) => {});

// 대표 포켓몬 설정
router.post("/mainpoke", (req, res) => {});

// 포켓몬 진화
router.get("/evolution", (req, res) => {});

// 포켓몬 경험치
router.post("/exp", (req, res) => {});

module.exports = router;
