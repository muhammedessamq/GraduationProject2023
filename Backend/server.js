const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const { sessionMiddleware } = require('./util/config');
app.use(sessionMiddleware);
const path = require('path');
const mime = require('mime');

app.use(bodyParser.json());

//Database Connection
const database = require("./database");

const registerRouter = require("./routes/registerRouter");
const adminRouter = require("./routes/adminRouter");
const loginRouter = require("./routes/loginRouter");
const ngoProfileRouter = require("./routes/ngoProfileRouter");
const donatorProfileRouter = require("./routes/donatorProfileRouter");
const donatorHomeRouter = require("./routes/donatorHomeRouter");
const ngoHomeRouter = require("./routes/ngoHomeRouter");

// Set CORS headers
app.use(cors({
  origin: 'http://localhost:3000',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Allow OPTIONS requests to avoid pre-flight CORS checks
app.options('*', cors());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    const contentType = mime.getType(filePath);
    res.setHeader('Content-Type', contentType);
  },
}));

app.use("/api/Register",registerRouter);
app.use("/api/Login",loginRouter);
app.use("/api/Admin",adminRouter);
app.use("/api/DonatorProfile",donatorProfileRouter);
app.use("/api/DonatorHome",donatorHomeRouter);
app.use("/api/NGOHome",ngoHomeRouter);
app.use("/api/NGOProfile",ngoProfileRouter);

// start the server
const port = 4000;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

server.on('error', (err) => {
  console.log(err);
});