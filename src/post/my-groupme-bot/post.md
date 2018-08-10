---
title: My GroupMe Bot NPM Module
description: A simple GroupMe bot building and hosting module.
tags:
- code
- javascript
- nodejs
- groupme
- api
- bot
- chatbot
- jsdoc
- module
- json
- git
links:
  npm: https://www.npmjs.com/package/my-groupme-bot
  github: https://github.com/TomerAberbach/my-groupme-bot
  documentation: https://tomeraberba.ch/my-groupme-bot/module-my-groupme-bot.html
timestamp: 05/23/2018
---
> A simple GroupMe bot building and hosting module.

## Install

Install with [npm](https://www.npmjs.com):

```sh
$ npm i my-groupme-bot --save
```

## Usage

### Dad Bot
The bot, inspired by dads everywhere, takes any declarations about yourself very literally.

Example:
```
User: I'm feeling great today
Bot: Hi feeling great today, I'm dad!
```
Code:
```js
const bot = require('my-groupme-bot')

bot.config('YOUR_BOT_ID')
  .pattern(
    /(i'?m|i\s+am)\s+[^.?!]*[.?!]?/gi,
    (message, matches) => bot.send(matches.map(match =>
      `Hi ${match.trim().replace(/^(i'?m|i\s+am)\s+/gi, '')}, I'm dad!`
    ).join('\n'))
  ).listen(process.env.PORT)
```

### Ted and Robin Bot
The bot, inpired by How I Met Your Mother, salutes any army, navy, etc. officer mentioned in a chat!

Example:
```
User: Well yeah, that's the general idea
Bot: *salutes* general idea
```
Code:
```js
const bot = require('my-groupme-bot')

bot.config('YOUR_BOT_ID')
  .pattern(new RegExp(`(${[
    'general',
    'private',
    'corporal',
    'lieutenant',
    'major',
    'captain',
    'admiral',
    'colonel',
    'kernel',
    'sergeant',
    'specialist',
    'marine',
    'officer'
  ].join('|')})[^.]*\\.?`, 'gi'),
    (message, matches) => bot.send(matches.map(match => `*salutes* ${match.trim()}`).join('\n'))
  ).listen(process.env.PORT)
```

Documentation for the all the functions can be found [here](https://tomeraberba.ch/my-groupme-bot/module-my-groupme-bot.html).

## Contributing

Pull requests and stars on the [Github repository](https://github.com/TomerAberbach/my-groupme-bot) are always welcome. For bugs and feature requests, [please create an issue](https://github.com/TomerAberbach/my-groupme-bot/issues/new).

## Running Tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## License

Copyright © 2018 Tomer Aberbach
Released under the [MIT license](https://github.com/TomerAberbach/my-groupme-bot/blob/master/LICENSE).