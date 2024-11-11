const asyncHandler = require("express-async-handler");
const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const validateInput = (name, userid, password) => {
  const errors = [];
  
  if (!userid || userid.length < 4) {
    errors.push("아이디는 최소 4자 이상이어야 합니다.");
  }
  
  if (!password || password.length < 6) {
    errors.push("비밀번호는 최소 6자 이상이어야 합니다.");
  }
  
  if (name && name.length < 2) {
    errors.push("이름은 최소 2자 이상이어야 합니다.");
  }
  
  return errors;
};

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const {name, userid, password} = req.body;
    const validationErrors = validateInput(name, userid, password);

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false,
        errors: validationErrors 
      });
    }

    try{

      let user = await User.findOne({ userid });
      if (user) {
        res.status(400);
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name,
        userid,
        password: hashedPassword
      });
      const token = jwt.sign({id: user._id}, jwtSecret, {
        expiresIn: '1d'
      });
      res.status(201).json({
        success: true,
        message: '회원가입이 완료되었습니다.',
        user: {
          id: user._id,
          name: user.name,
          userid: user.userid
        }
      });
    } catch(error) {
      res.status(500).json({
        success: false,
        message: '서버 오류가 발생했습니다.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });


const loginUser = asyncHandler(async (req, res) => {
    const {userid, password} = req.body;
    try{

      const user = await User.findOne({ userid });
      if(!user) {
        return res.status(401).json({message: "일치하는 사용자가 없습니다."});
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(401).json({
          success: false,
          message: "비밀번호가 일치하지 않습니다."
        });
      }
      const token = jwt.sign({id: user._id}, jwtSecret);
      res.cookie("token", token, {httpOnly: true});
      res.json({
        success: true,
        message: '로그인이 완료되었습니다.',
        user: {
          id: user._id,
          name: user.name,
          userid: user.userid
        }
      });
   
    } catch(error) {
      res.status(500).json({
        success: false,
        message: '서버 오류가 발생했습니다.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    });
    const logoutUser = asyncHandler(async (req, res) => {
      res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
      });
      
      res.json({
        success: true,
        message: '로그아웃되었습니다.'
      });
    });
    
    module.exports = {registerUser, loginUser, logoutUser};