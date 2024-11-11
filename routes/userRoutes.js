const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const checkLogin = require("../middlewares/checkLogin");
const {registerUser, loginUser} = require("../controllers/userController");
const path = require("path");

router.use(cookieParser());

// 메인 페이지 (rice.html)
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/rice.html"));
});

// 로그인/회원가입 라우트
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/regi.html"));
});

// API 엔드포인트
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;