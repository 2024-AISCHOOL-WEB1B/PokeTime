const express = require("express");
const router = express.Router();
const conn = require("../config/db");

// 도감 조회
router.get("/info", (req, res) => {});

// 도감 색인
router.get("/index", (req, res) => {});

// 대표 포켓몬 설정
router.post("/mainpoke", (req, res) => {});

// 포켓몬 진화
router.get("/evolution", (req, res) => {});

// 포켓몬 경험치
router.post("/exp", (req, res) => {});

module.exports = router;
