const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const checkLogin = (req, res, next) => {
    console.log('쿠키 확인:', req.cookies); // 디버깅용

    if (!req.cookies || !req.cookies.token) {
        console.log('토큰 없음, 로그인 페이지로 이동'); // 디버깅용
        return res.redirect('/login');
    }
    next();
};

module.exports = checkLogin;