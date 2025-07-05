const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const signatureRoutes = require('./routes/signatureRoutes');
const AuthRouter = require("./routes/authRouter")
const docRoutes = require('./routes/docRoutes');
const PORT = process.env.PORT || 8080;
const session = require('express-session');
const cookieParser = require("cookie-parser");
require('dotenv').config();
require("./models/db")
app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors({
  origin: ['https://document-signature-app-client-h0vk6a82d.vercel.app'],
  credentials: true,               // ✅ allow cookies to be sent
}));
app.use(express.json());

app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/signed-uploads', express.static(path.join(__dirname, 'signed-uploads')));
app.use('/api/auth', AuthRouter);
app.use('/api/docs', docRoutes);
app.use('/api/signatures', signatureRoutes);
const fs = require('fs');
const signedUploadsDir = path.join(__dirname, 'signed-uploads');
if (!fs.existsSync(signedUploadsDir)) fs.mkdirSync(signedUploadsDir);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})



