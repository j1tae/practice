require("dotenv").config();
const express = require("express");
const cors = require('cors');
const path = require("path");
const connectDb = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;
connectDb();

// 미들웨어 순서 수정
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // static 미들웨어를 먼저

// 라우터 설정
app.use("/", require("./routes/userRoutes")); // 라우터는 그 다음에

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Local: http://localhost:${port}`);
    console.log(`Network: http://${getLocalIpAddress()}:${port}`);
});

function getLocalIpAddress() {    
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    return '0.0.0.0';
}