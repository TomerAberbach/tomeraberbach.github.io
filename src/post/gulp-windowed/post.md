---
title: Gulp Windowed NPM Module
description: A Gulp plugin that processes and maps files in windows/arrays of a specified size.
tags:
- code
- javascript
- nodejs
- git
- module
- gulp
- plugin
links:
  npm: https://www.npmjs.com/package/gulp-windowed
  github: https://github.com/TomerAberbach/gulp-windowed
timestamp: 08/08/2018
---
> Processes and maps files in windows/arrays of a specified size.

## Install

Install with [npm](https://www.npmjs.com):

```sh
$ npm i gulp-windowed --save
```

## Usage

This example concatenates groups of 5 markdown files. If `src/posts` contained files `post0.md` through `post99.md` then the next pipe would receive a stream containing `page0.md` through `page19.md` where `page0.md` is the concatenation of `post0.md` through `post4.md`. The ordering is guaranteed by the use of [gulp-sort](https://www.npmjs.com/package/gulp-sort).

```js
const gulp = require('gulp')
const sort = require('gulp-sorted')
const windowed = require('gulp-windowed')
const concat = require('gulp-concat')

gulp.task('default', () =>
  gulp.src('src/posts/*.md') // Posts in markdown
    .pipe(sort()) // Sorted by filename
    .pipe(windowed(5, (files, i) => // In groups of 5
      files.pipe(concat(`page${i}.md`)) // Concatenated into one page where 'i' is the window number
    ))
    // More pipes...
)
```

Here it is used to split groups of files into different folders.

```js
const gulp = require('gulp')
const windowed = require('gulp-windowed')
const rename = require('gulp-rename')

gulp.task('default', () =>
  gulp.src('src/*')
    .pipe(windowed(10, (files, i, done) =>
      files.pipe(rename({
        dirname: `folder${i}`
      }))
    ))
    // More pipes...
)
```

Here it is used to skip every other file.

```js
const gulp = require('gulp')
const windowed = require('gulp-windowed')

gulp.task('default', () =>
  gulp.src('src/*')
    .pipe(windowed(1, (files, i, done) =>
      i % 2 === 0 ? files : done()
    ))
    // More pipes...
)
```

Notice that the stream of `File` objects in the callback can be returned from the callback. They are subsequently written to the resulting stream for the next pipe *outside* the callback. This is useful because it allows you to perform stream operations on the groups of files, while also allowing you to merge the resulting streams back together to continue performing operations. 

If you'd like an array of `File` objects instead of a stream then call `windowed.array` instead.

## Method

`windowed(n, cb) -> DuplexObjectStream<File>`

Calls `cb` with a readable object stream (or array for `window.array`) containing `n` [vinyl](https://www.npmjs.com/package/vinyl) `File` objects each time `n` are written to it. On stream end if there are any remaining `File` objects because the `n` threshold was not met then `cb` is called with a readable object stream (or array for `window.array`) containing the remaining [0, `n`) `File` objects. The contents of the duplex object stream returned by the method depends on `cb` (explained below).

Parameters:
 * `n` : `int` - A number of `File` objects to include per window. Must be a positive integer.
 * `cb` : `(files, i, done) -> File | Array<File> | Promise<File | Array<File> | *> | Observable<File | Array<File> | *> | ChildProcess | ReadableObjectStream<File> | undefined` - A callback which either calls `done` or returns a `File` object, an array of `File` objects, or an asynchronous operation in some returnable format (see possible `cb` return types and [async-done](https://www.npmjs.com/package/async-done)). If an asynchronous operation is returned it will be resolved. If the result of `cb`, through calling `done` or returning an asynchronous operation, is a `File` object or an array of `File` objects then they will be written to the duplex object stream returned from `windowed`.
   * `files` : `ReadableObjectStream<File> | Array<File>` - A readable object stream (or array for `window.array`) containing up to `n` [vinyl](https://www.npmjs.com/package/vinyl) `File` objects (see above from why not exactly `n`).
   * `i` : `int` - The current zero-based window number (i.e. the number of times `cb` has been called minus one).
   * `done` : `(err, result) -> undefined` - Call `done(new Error(...))` for error or `done(null, result)` for success when performing asynchronous operations in non-returnable format or when performing strictly synchronous operations. This method does not need to be and should not be called if a valid value of the types mentioned above is returned from `cb`.

## Pairs Well With

 * [gulp-sort](https://www.npmjs.com/package/gulp-sort)
 * [gulp-concat](https://www.npmjs.com/package/gulp-concat)
 * [gulp-rename](https://www.npmjs.com/package/gulp-rename)
 * [through2](https://www.npmjs.com/package/through2)

## Contributing

Pull requests and stars on the [GitHub repository](https://github.com/TomerAberbach/gulp-windowed) are always welcome. For bugs and feature requests, [please create an issue](https://github.com/TomerAberbach/gulp-windowed/issues/new).

## Running Tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## License

Copyright © 2018 Tomer Aberbach
Released under the [MIT license](https://github.com/TomerAberbach/gulp-windowed/blob/master/LICENSE).