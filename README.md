# DJ Joubi Service
Node.js API service for authorizing DJ Joubi with Spotify and fetching playlists and tracks.

## Prerequisites
1. Install the latest version of [Node.js](https://nodejs.org/en/download).
2. Install the latest version of [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
3. [Create a new app in your Spotify Developer account.](https://developer.spotify.com/dashboard).

## Local Build and Development Instructions
1. Clone the repo into Visual Studio Code or your IDE of choice.
2. Add a .env file in the root folder of the project with the following environment variable:

    ```
    PORT=8888
    CLIENT_ID={your_client_id}
    CLIENT_SECRET={your_client_secret}
    REDIRECT_URI={your_redirect_uri}
    ```
3. Run ```npm install``` to generate node_modules.
4. Run ```npm run start``` to start the local server at http://127.0.0.1:8888.
5. Set up the DJ Joubi React app frontend.