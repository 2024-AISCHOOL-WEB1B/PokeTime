const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 사진 찍었을 때 경험치 획득
router.post("/picture", (req, res) => {});

// 출석 했을 때 경험치 획득
router.post("/attend", (req, res) => {});

// 포인트 로그 조회
router.post("/log", (req, res) => {});

module.exports = router;
