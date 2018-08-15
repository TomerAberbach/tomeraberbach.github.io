---
title: Imgflip NPM Module
description: A module for the interacting with the Imgflip API.
tags:
- code
- javascript
- nodejs
- git
- module
- imgflip
- memes
- api
- json
links:
  npm: https://www.npmjs.com/package/imgflip
  github: https://github.com/TomerAberbach/imgflip
timestamp: 07/13/2018
---
> A module for the interacting with the Imgflip API.

## Install

Install with [npm](https://www.npmjs.com):

```sh
$ npm i imgflip --save
```

## Usage

```js
const imgflip = require('imgflip')

// https://imgflip.com/signup
imgflip.credentials({
  username: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD'
})

/* https://api.imgflip.com/get_memes
 * Get top 100 popular meme formats
 */
imgflip.memes().then(memes => {
  // ID of the top meme
  const id = memes[0]['id']

  // Get URL instead using imgflip.meme, omit path argument
  return imgflip.image('meme.jpg', id, 'MEME', 'CITY')
})
```

## Contributing

Pull requests and stars on the [GitHub repository](https://github.com/TomerAberbach/imgflip) are always welcome. For bugs and feature requests, [please create an issue](https://github.com/TomerAberbach/imgflip/issues/new).

## Running Tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## License

Copyright © 2018 Tomer Aberbach
Released under the [MIT license](https://github.com/TomerAberbach/imgflip/blob/master/LICENSE).