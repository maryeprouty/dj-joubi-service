// /api/playlists
export const getPlaylists = async (req, res) => {

  const options = {
    headers: {
      'Authorization': `Bearer ${req.session.accessToken}` 
    }
  }

  const result = await fetch('https://api.spotify.com/v1/me/playlists/', options);
  const playlists = await result.json();

  res.send({
    playlists
  });

};

// /api/tracks
export const getTracks = async (req, res) => {

  const options = {
    headers: {
      'Authorization': `Bearer ${req.session.accessToken}` 
    }
  }

  const result = await fetch(`https://api.spotify.com/v1/playlists/${req.query.playlist}/tracks`, options);
  const tracks = await result.json();

  res.send({
    tracks
  });

};

// /api/playSelectedPlaylist
export const playSelectedPlaylist = async (req, res) => {

  const options = {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${req.session.accessToken}`
    },
  }
  options.body = JSON.stringify(req.body);

  const result = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${req.query.device_id}`, options);

  res.send({
    result
  });
  
};