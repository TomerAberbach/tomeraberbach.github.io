---
title: src2img NPM Module
description: Converts source code to high quality images.
tags:
- code
- javascript
- nodejs
- git
- module
- jsdoc
- img
- puppeteer
- prismjs
links:
  npm: https://www.npmjs.com/package/src2img
  github: https://github.com/TomerAberbach/src2img
timestamp: 08/13/2018
---
> Converts source code to high quality images.

## Install

Install with [npm](https://www.npmjs.com):

```sh
$ npm i src2img --save
```

## Usage

```js
const fs = require('fs')
const path = require('path')
const src2img = require('src2img')

const src = 'path/to/sources'
const out = 'path/to/out'

const names = fs.readdirSync(src)

src2img({
  fontSize: 20, // Font size and unit control the size and quality of the image
  fontSizeUnit: 'pt',
  padding: 3,
  paddingUnit: 'vw', // Using 'px' does not scale with font size
  type: 'png', // png or jpeg
  src: names.map(name => [
    fs.readFileSync(path.join(src, name)).toString(),
    'javascript' // https://prismjs.com/index.html#languages-list
    // See https://www.npmjs.com/package/filename2prism for getting alias from filename
  ])
}).then(images => Promise.all(images.map(
  (image, i) => fs.writeFileSync(path.join(out, `${names[i].replace(/\.[^.]+$/g, '')}.png`), image))
))
```

Look at the [CLI package](https://www.npmjs.com/package/src2img-cli) if you'd like to use this from the command line.

Some rendered code:

![example](/img/src2img-example.png)

## Related

 * [filename2prism](https://www.npmjs.com/package/filename2prism)
 * [src2img-cli](https://www.npmjs.com/package/src2img-cli)
 * [prismjs](https://www.npmjs.com/package/prismjs)

## Contributing

Pull requests and stars on the [GitHub repository](https://www.npmjs.com/package/src2img) are always welcome. For bugs and feature requests, [please create an issue](https://github.com/TomerAberbach/src2img/issues/new).

## Running Tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## License

Copyright © 2018 Tomer Aberbach
Released under the [MIT license](https://github.com/TomerAberbach/src2img/blob/master/LICENSE).