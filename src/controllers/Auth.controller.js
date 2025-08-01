import request from 'request';
import querystring from 'querystring';
import generateRandomString from '../utils/RandomGenerator.util.js';

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI; 

const stateKey = 'spotify_auth_state';
const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming';

// /api/login
export const login = (req, res)  => {

  const state = generateRandomString(16);
  res.cookie(stateKey, state, {
    secure: true,
    sameSite: 'none',
    httpOnly: true
  });
  console.log(`Login state: ${state}`);
  console.log('Request protocol:', req.protocol);
  console.log('X-Forwarded-Proto header:', req.headers['x-forwarded-proto']); 

  // Request authorization with the Spotify API to access playlists and web playback SDK
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    }));
};

// /callback
export const callback = (req, res) => {

  // Request tokens for authorization if the state check passes
  // and redirect back to the client.
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;
  console.log(`Stored state: ${storedState} vs current state: ${state}`);
  console.log('Request protocol:', req.protocol);
  console.log('X-Forwarded-Proto header:', req.headers['x-forwarded-proto']); 

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch', state: state
      }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        req.session.accessToken = body.access_token;
        req.session.refreshToken = body.refresh_token;

        // Refresh token every 55 minutes (3300000 milliseconds)
        setInterval(() => refreshToken(req), 3300000); 

        res.redirect('https://127.0.0.1:5173/home');

      } else {
        res.redirect('https://127.0.0.1:5173/invalid?' +
          querystring.stringify({
            error: 'invalid_token'
        }));
      }
    });
  }
};

// /api/access_token
export const getAccessToken = (req, res) => {
  res.send({
    "access_token": req.session.accessToken
  })
};

function refreshToken(req) {

  const refresh_token = req.session.refreshToken;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')) 
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {

    if (!error && response.statusCode === 200) {
      
      req.session.accessToken = body.access_token;
      req.session.refreshToken = body.refresh_token ? body.refresh_token : req.session.refreshToken;
      req.session.save();

    }

  });
}