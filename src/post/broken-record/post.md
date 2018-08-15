---
title: Broken Record NPM Module
description: A Handlebars powered CLI tool for defining file and directory structure templates.
tags:
- code
- javascript
- nodejs
- git
- module
- template
- handlebars
- cli
- filesystem
links:
  npm: https://www.npmjs.com/package/broken-record
  github: https://github.com/TomerAberbach/broken-record
timestamp: 08/07/2018
---
> A Handlebars powered CLI tool for defining file and directory structure templates.

Repeatably setting up new projects the same way can be annoying.

Broken Record allows you to define templates which can then be invoked and filled out in hassle-free way.

## Install

Install with [npm](https://www.npmjs.com):

```sh
$ npm i broken-record -g
```

## Usage

Show help information:

```sh
$ broken-record -h

Usage: broken-record [options] [command]

  Options:

    -V, --version         output the version number
    -h, --help            output usage information

  Commands:

    config [dir]          Displays or sets the templates directory
    register <dir>        Registers a template at a specified directory
    list                  Lists the available templates
    remove <name>         Removes a registered template
    get [options] <name>  Retrieves a registered template
    show [name]           Opens the templates directory or a template in the file explorer

  Template Specification:

    Directory Structure:
      <template-name>
          ├── template <-- template files directory
          └── template.json

    template.json:
      {
        "options": [
          {
            "name": "<variable-name>", <-- required
            "message": "<displayed-message>", <-- value of "name" used by default,
            "value": "<default-value-or-choices-array>" <-- default value can be boolean
          },
          ...
        ],
        "embed": {
          "<template-name>": {
            "directory": "<path-relative-to-template-dir>", <-- required
            "options": {
              "<option1>": "<handlebars-template>",
              ...
            }
          },
          ...
        }
      }
```

Set the templates directory location:

```sh
$ broken-record config
Looks like this is your first time running this command!
? Where should the 'templates' directory be created? path/to/some/dir
path/to/some/dir
```

Try out an example:

```sh
$ git clone https://github.com/TomerAberbach/broken-record-templates.git
$ cd broken-record-templates
$ broken-record register mit
The provided template was successfully registered.
$ broken-record register js-npm-module
The provided template was successfully registered.
$ broken-record get js-npm-module
```

## Related projects

* [broken-record-templates](https://github.com/TomerAberbach/broken-record-templates)

## Contributing

Pull requests and stars in the [GitHub repository](https://github.com/TomerAberbach/broken-record) are always welcome. For bugs and feature requests, [please create an issue](https://github.com/TomerAberbach/broken-record/issues/new).

## Running Tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## License

Copyright © 2018 Tomer Aberbach
Released under the [MIT license](https://github.com/TomerAberbach/broken-record/blob/master/LICENSE).