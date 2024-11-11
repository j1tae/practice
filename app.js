require("dotenv").config();
const express = require("express");
const cors = require('cors');
const path = require("path");
const connectDb = require("./config/db");

const app = express();
connectDb();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public'))); 

// 모든 라우트를 userRoutes로 처리
app.use("/", require("./routes/userRoutes")); 

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});