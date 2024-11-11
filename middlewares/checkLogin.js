const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const checkLogin = async(req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.redirect("/login");//토큰이 없을 경우 로그인 페이지로 이동
    }
    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.id;
        next();
    } catch(error){
       res.clearCookie('token');
       return res.redirect("/login");
    }
};
module.exports = checkLogin;