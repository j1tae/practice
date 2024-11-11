const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const checkLogin = require("../middlewares/checkLogin");
const {registerUser, loginUser} = require("../controllers/userController");
const path = require("path");

router.use(cookieParser());
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/rice.html"));
});
// 순서 변경: 로그인/회원가입 라우트를 먼저 정의
router.get("/login", (req, res) => {
    // 이미 로그인된 경우 메인 페이지로
    if (req.cookies && req.cookies.token) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/regi.html"));
});

// API 라우트
router.post("/register", registerUser);
router.post("/login", loginUser);

// 인증이 필요한 라우트는 마지막에
router.get("/", checkLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/main.html")); // 또는 다른 메인 페이지
});

module.exports = router;