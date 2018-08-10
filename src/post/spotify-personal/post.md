---
title: Spotify Personal Authentication NPM Module
description: A Spotify authorization code flow implementation for local personal use.
tags:
- code
- javascript
- nodejs
- oauth
- spotify
- api
- git
- module
- json
- jsdoc
links:
  npm: https://www.npmjs.com/package/spotify-personal-auth
  github: https://github.com/TomerAberbach/spotify-personal-auth
timestamp: 04/29/2018
---
> A Spotify authorization code flow implementation for local personal use.

## Install

Install with [npm](https://www.npmjs.com):

```sh
$ npm i spotify-personal-auth --save
```

## Usage

```js
const auth = require('spotify-personal-auth')
const SpotifyWebApi = require('spotify-web-api-node')

// Configure module
auth.config({
  clientId: 'YOUR_CLIENT_ID', // Replace with your client id
  clientSecret: 'YOUR_CLIENT_SECRET', // Replace with your client secret
  scope: ['user-modify-playback-state', 'user-top-read'], // Replace with your array of needed Spotify scopes
  path: '/path/to/a/tokens.json' // Optional path to file to save tokens (will be created for you)
})

const api = new SpotifyWebApi()

/* Get token promise, the token will refresh if this is called when it has expired,
 * But you can get the refresh token if you would rather handle it
 * It is resolve as an array containing the token and refresh as shown below
 */
auth.token().then(([token, refresh]) => {
  // Sets api access and refresh token
  api.setAccessToken(token)
  api.setRefreshToken(refresh)

  return api.getMyTopTracks()
}).then(data =>
  // Plays user's top tracks
  api.play({
    uris: data['body']['items'].map(item => item['uri'])
  })
).catch(console.log)
```

## Contributing

Pull requests and stars on the [Github repository](https://github.com/TomerAberbach/spotify-personal-auth) are always welcome. For bugs and feature requests, [please create an issue](https://github.com/TomerAberbach/spotify-personal-auth/issues/new).

## Running Tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## License

Copyright © 2018 Tomer Aberbach
Released under the [MIT license](https://github.com/TomerAberbach/spotify-personal-auth/blob/master/LICENSE).