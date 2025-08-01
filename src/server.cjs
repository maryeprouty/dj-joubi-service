/**
 * This Node.js application uses the Express framework to connect
 * to Spotify using the OAuth2 code flow:
 * https://developer.spotify.com/documentation/web-api/tutorials/code-flow
 */

const express = require('express');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authController = require('./controllers/Auth.controller.js');
const playlistController = require('./controllers/Playlist.controller.js');

const app = express();

const originUrl = 'https://127.0.0.1:5173';

app.use(session({
  secret: "joubijou",
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: true,
    sameSite: 'none',
    httpOnly: true
   }
}));

app.use(express.static(__dirname + '/public'))
   .use(cors({credentials: true, origin: originUrl}))
   .use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', originUrl);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.set('trust proxy', true);

const router = express.Router();

router.get("/api/login", authController.login);
router.get("/callback", authController.callback);
router.get("/api/access_token", authController.getAccessToken);

router.get("/api/playlists", playlistController.getPlaylists);
router.get("/api/tracks", playlistController.getTracks);
router.put("/api/play", playlistController.play);
router.put("/api/pause", playlistController.pause);

app.use("", router);

const PORT = process.env.PORT || 8888;
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(PORT, () => console.log(`Server running on port ${PORT}`));