// File System
const path = require('path')
const fs = require('fs')
const del = require('del')
const glob = require('glob')

// Utilities
const union = require('arr-union')

// Gulp
const gulp = require('gulp')
const File = require('vinyl')

// Generic Gulp Plugins
const gulpif = require('gulp-if')
const filter = require('gulp-filter')
const rename = require('gulp-rename')
const groupConcat = require('gulp-group-concat')
const sort = require('gulp-sort')
const windowed = require('gulp-windowed')

// Streams
const through = require('through2')
const merge = require('merge-stream')
const branch = require('branch-pipe')
const intoStream = require('into-stream')
const buffer = cb => {
  const files = []
  return through.obj((file, enc, done) => {
    files.push(file)
    done()
  }, function (done) {
    const result = cb(files)

    if (result) {
      result
        .on('data', file => this.push(file))
        .on('end', done)
    } else {
      files.forEach(file => this.push(file))
      done()
    }
  })
}

// HTML
const htmlmin = require('gulp-htmlmin')

// Markdown
const markdown = require('gulp-markdownit')
const markdownsup = require('markdown-it-sup')
const markdownsub = require('markdown-it-sub')
const markdownkbd = require('markdown-it-kbd')
const markdownanchor = require('markdown-it-anchor')
const markdownhighlight = require('markdown-it-highlightjs')
const markdownvideo = require('markdown-it-video')
const markdownlink = require('markdown-it-link-attributes')

const markdownit = require('markdown-it')({html: true, typographer: true})
  .use(markdownsup)
  .use(markdownsub)
  .use(markdownkbd)
  .use(markdownanchor, {permalink: true})
  .use(markdownhighlight, {auto: false})
  .use(markdownvideo, {youtube: {width: 640, height: 390}})
  .use(markdownlink, {attrs: {target: '_blank', rel: 'noopener'}})

// CSS
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

// JavaScript
const uglify = require('gulp-uglify-es').default

// Images
const imagemin = require('gulp-imagemin')
const jimp = require('jimp')
const favicon = require('gulp-real-favicon')

// Handlebars
const hb = require('gulp-hb')
const hbhelpers = require('handlebars-helpers')

// YAML
const matter = require('gulp-gray-matter')
const YAML = require('yaml').default

/*
 * TASKS
 */
const clean = () => del(['dist', 'favicon.json'])

const data = {
  svg: {},
  img: {},
  tags: {},
  css: {},
  js: {}
}

const global = done => {
  data.global = YAML.parse(fs.readFileSync('src/global.yaml').toString())
  done()
}

const svg = () =>
  gulp.src('src/svg/*')
    .pipe(imagemin([imagemin.svgo({plugins: [{removeTitle: false}]})]))
    .pipe(through.obj((file, enc, cb) => {
      data.svg[file.basename.substring(0, file.basename.length - file.extname.length)] = file.contents.toString()
      cb()
    }))

const img = () =>
  merge(
    gulp.src(['src/img/**/*.{gif,jpg,jpeg,png,svg}', '!src/img/term/*.svg']),
    gulp.src('src/post/*/*.{gif,jpg,jpeg,png,svg}')
      .pipe(rename(p => {
        p.basename = path.basename(p.dirname)
        p.dirname = 'post'
        data.img[p.basename] = p.extname.substring(1)
      }))
      .pipe(gulpif(
        file => file.extname !== '.gif' && file.extname !== '.svg',
        through.obj((file, enc, cb) =>
          jimp.read(file.contents).then(img => {
            if (img.bitmap.width > 500 && img.bitmap.height > 500) {
              img.scaleToFit(500, 500, jimp.RESIZE_BILINEAR)
            }

            return img.getBufferAsync(jimp.MIME_PNG)
          }).then(buffer => {
            file.contents = buffer
            cb(null, file)
          })
        )
      ))
  ).pipe(imagemin([
    imagemin.gifsicle(),
    imagemin.jpegtran(),
    imagemin.optipng(),
    imagemin.svgo({plugins: [{removeTitle: false}]})
  ])).pipe(gulp.dest('dist/img'))

const included = (ext, optimize) => () =>
  merge(
    gulp.src(`src/post/*/*.${ext}`)
      .pipe(rename(p => {
        p.basename = path.basename(p.dirname)
        p.dirname = ''
        data[ext][p.basename] = true
      })),
    gulp.src(`src/${ext}/**/*.${ext}`)
      .pipe(groupConcat({
        'page': `src/${ext}/page/*.${ext}`,
        'post': `src/${ext}/post/*.${ext}`,
        'tags': `src/${ext}/tags/*.${ext}`,
        'all': `src/${ext}/*.${ext}`
      }))
      .pipe(rename(p => {
        p.extname = `.${ext}`
        data[ext][p.basename] = true
      }))
  ).pipe(optimize()).pipe(gulp.dest('dist/css'))

const css = included('css', () => postcss([autoprefixer, cssnano]))
const js = included('js', uglify)
const other = () => gulp.src('src/other/**/*').pipe(gulp.dest('dist/other'))

const favicons = cb => favicon.generateFavicon({
  masterPicture: 'src/img/icon.png',
  dest: 'dist/favicon',
  iconsPath: 'favicon/',
  design: {
    ios: {
      pictureAspect: 'backgroundAndMargin',
      backgroundColor: '#ffffff',
      margin: '14%',
      assets: {
        ios6AndPriorIcons: false,
        ios7AndLaterIcons: false,
        precomposedIcons: false,
        declareOnlyDefaultIcon: true
      }
    },
    desktopBrowser: {},
    windows: {
      pictureAspect: 'noChange',
      backgroundColor: '#da532c',
      onConflict: 'override',
      assets: {
        windows80Ie10Tile: false,
        windows10Ie11EdgeTiles: {
          small: false,
          medium: true,
          big: false,
          rectangle: false
        }
      }
    },
    androidChrome: {
      pictureAspect: 'shadow',
      themeColor: '#ffffff',
      manifest: {
        display: 'standalone',
        orientation: 'notSet',
        onConflict: 'override',
        declared: true
      },
      assets: {
        legacyIcon: false,
        lowResolutionIcons: false
      }
    },
    safariPinnedTab: {
      pictureAspect: 'silhouette',
      themeColor: '#5bbad5'
    }
  },
  settings: {
    scalingAlgorithm: 'Mitchell',
    errorOnImageTooSmall: false,
    readmeFile: false,
    htmlCodeFile: false,
    usePathAsIs: false
  },
  markupFile: 'favicon.json'
}, cb)

const html = () =>
  gulp.src('src/post/*/post.md')
    .pipe(matter())
    .pipe(through.obj((file, enc, cb) => {
      file.data.title = markdownit.renderInline(file.data.title)
      file.data.description = markdownit.renderInline(file.data.description)
      file.data.content = file.contents.toString()

      if (file.data.content !== '') {
        file.data.tags.push('read')
      }

      file.data.tags = union(file.data.tags, Object.keys(file.data.links))
      file.data.tags.sort((a, b) => a.localeCompare(b)).forEach(tag => {
        data.tags[tag] = true
      })
      file.data.id = path.basename(file.dirname)
      file.data.img = `${file.data.id}.${data.img[file.data.id]}`

      if (file.data.timestamp) {
        const [month, day, year] = file.data.timestamp.split('/').map(item => parseInt(item))
        file.data.timestamp = new Date(year, month - 1, day)
      } else {
        file.data.timestamp = new Date()
      }

      file.data.svg = data.svg

      cb(null, file)
    }))
    .pipe(branch.obj(src => [
      src.pipe(through.obj((file, enc, cb) => cb(null, file.clone({deep: true}))))
        .pipe(filter(file => file.contents.toString().trim() !== ''))
        .pipe(markdown({
          options: {
            html: true,
            typographer: true
          },
          plugins: [
            markdownsup,
            markdownsub,
            markdownkbd,
            {plugin: markdownanchor, options: {permalink: true}},
            {plugin: markdownhighlight, options: {auto: false}},
            {plugin: markdownvideo, options: {youtube: {width: 640, height: 390}}},
            {plugin: markdownlink, options: {attrs: {target: '_blank', rel: 'noopener'}}}
          ]
        }))
        .pipe(rename(p => {
          p.basename = path.basename(p.dirname)
          p.dirname = 'html/post'
          p.extname = '.html'
        }))
        .pipe(through.obj((file, enc, cb) => {
          ['js', 'css'].forEach(ext => {
            file.data[ext] = ['all', 'post', file.basename]
              .filter(a => data[ext][a])
              .map(a => path.join(ext, `${a}.${ext}`))
          })

          file.data.content = file.contents.toString()
          file.contents = fs.readFileSync('src/layout/post.hbs')

          cb(null, file)
        })),
      src.pipe(sort((a, b) => b.data.timestamp - a.data.timestamp))
        .pipe(windowed.array(4, (files, i) => {
          const out = []

          if (i === 0) {
            out.push('index.html')
          }

          out.push(`html/page/${i + 1}.html`)

          const contents = fs.readFileSync('src/layout/page.hbs')

          return out.map(p => {
            const fileData = {
              title: `Page ${i + 1}`,
              tags: union([], ...files.map(file => file.data.tags)),
              i,
              total: Math.ceil(glob.sync('src/post/*/post.md').length / 4),
              page: `html/page`,
              posts: files.map(file => file.data),
              svg: data.svg
            };

            ['js', 'css'].forEach(ext => {
              fileData[ext] = ['all', 'page']
                .filter(a => data[ext][a])
                .map(a => path.join(ext, `${a}.${ext}`))
            })

            return new File({path: p, contents, data: fileData})
          })
        })),
      src.pipe(buffer(files => {
        data.tags = Object.keys(data.tags).sort((a, b) => a.localeCompare(b))

        return merge(
          intoStream.obj(new File({
            path: 'html/tag/tags.html',
            contents: fs.readFileSync('src/layout/tags.hbs'),
            data: {
              title: 'Tags',
              tags: data.tags,
              js: ['all', 'tags'].filter(a => data['js'][a]).map(a => path.join('js', `${a}.js`)),
              css: ['all', 'tags'].filter(a => data['css'][a]).map(a => path.join('css', `${a}.css`)),
              svg: data.svg
            }
          })),
          ...data.tags.map(tag => {
            const filtered = files.filter(file => file.data.tags.some(item => item === tag))
            const total = Math.ceil(filtered.length / 4)

            return intoStream.obj(filtered)
              .pipe(sort((a, b) => b.data.timestamp - a.data.timestamp))
              .pipe(windowed.array(4, (files, i) => {
                const file = new File({
                  path: `html/tag/${tag}/${i + 1}.html`,
                  contents: fs.readFileSync('src/layout/page.hbs'),
                  data: {
                    title: `${tag} Page ${i + 1}`,
                    tags: union([], ...files.map(file => file.data.tags)),
                    i,
                    total,
                    page: `html/tag/${tag}`,
                    posts: files.map(file => file.data),
                    svg: data.svg
                  }
                });

                ['js', 'css'].forEach(ext => {
                  file.data[ext] = ['all', 'page']
                    .filter(a => data[ext][a])
                    .map(a => path.join(ext, `${a}.${ext}`))
                })

                return file
              }))
          })
        )
      }))
    ]))
    .pipe(hb().helpers(hbhelpers))
    .pipe(through.obj((file, enc, cb) => {
      file.data.url = data.global.url
      file.data.subtitle = file.data.title
      file.data.title = data.global.title
      file.data.author = data.global.author

      if (typeof file.data.description === 'undefined') {
        file.data.description = data.global.description
      }

      file.data.tags = union([], data.global.tags, file.data.tags).sort((a, b) => a.localeCompare(b))
      file.data.social = data.global.social
      file.data.i = file.data.i || 0
      file.data.total = file.data.total || 0
      file.data.page = file.data.page || ''
      file.data.content = file.contents.toString()

      file.contents = fs.readFileSync('src/layout/html.hbs')
      cb(null, file)
    }))
    .pipe(hb().helpers(hbhelpers))
    .pipe(favicon.injectFaviconMarkups(JSON.parse(fs.readFileSync('./favicon.json')).favicon.html_code))
    .pipe(htmlmin({
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'))

gulp.task('clean', clean)
gulp.task('default', gulp.series(clean, favicons, gulp.parallel(gulp.series(gulp.parallel(global, js, css, img, svg), html), other)))
