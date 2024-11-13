const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const checkLogin = async(req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.redirect("/login");
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