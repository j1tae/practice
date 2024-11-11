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

// 라우터를 static 파일 미들웨어보다 먼저 설정
app.use("/", require("./routes/userRoutes")); 

// static 파일 미들웨어는 그 다음에
app.use(express.static(path.join(__dirname, 'public'))); 

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});