[![Build Status](https://api.travis-ci.org/wp-strap/webpack-entries-globber.svg?branch=master)](https://travis-ci.org/github/wp-strap/webpack-entries-globber)
![Tested with WebPack 5.12.3](https://img.shields.io/badge/Tested%20with%20WebPack-5.12.3-brightgreen)

# Webpack-entries-globber

This is a fork of Milanzor's Webpack-watched-glob-entries-plugin.

Provides a way to glob for entry files in Webpack `watch` and `non-watch` modes.

Read more about this plugin here:
https://github.com/Milanzor/webpack-watched-glob-entries-plugin

This version also adds the ability to convert camelcase folders & files to dashed names in the output and add a prefix to the
filename, so you can move it into a specific folder. I've made this fork for a specific use-case.

## Install

```sh
yarn add -D webpack-entries-globber
```

or

```sh
npm install --save-dev webpack-entries-globber
```

## Usage

```js

// Get the plugin
const WebpackEntriesGlobber = require('webpack-entries-globber');

// In your Webpack config:
{
... // At your entry definition

  entry: WebpackEntriesGlobber.getEntries(
    [
      // Your path(s) 
      {
        // The glob path
        globString: path.resolve(__dirname, 'entries/**/*.js'),
        // Makes sure the files and sub-folders are moved to this folder
        namePrefix: 'prefixed-folder/',
      },
      {
        globString: path.resolve(__dirname, 'More/**/*.js'),
      }
    ],
    // Glob options
    {
      // Optional glob options that are passed to glob.sync()
      ignore: '**/*.test.js'
    },
    // Plugin options
    {
      // Optional option to convert camelcase folders & files to dashed names
      camelcase_to_dashes: true
    }
  )

... // At the plugin definition

  plugins: [
    new WebpackEntriesGlobber(),
  ],

...
}

```

## Example

If you have the following source structure:

```
- entries
    - main.js
    - Some
        - stuff.js
    - Other
        - things.js 
- More
    - CamelCase
        - EntryFiles.js
        EntriesAndOther
            - Stuff.js
        
```

The entries will look like the following with the above <a href="#Usage">usage</a>:

```
{
    "prefixed-folder/main":               "/abs/path/to/entries/main.js",
    "prefixed-folder/some/stuff":         "/abs/path/to/entries/Some/stuff.js",
    "prefixed-folder/other/things":       "/abs/path/to/entries/Other/things.js",
    "camel-case/entry-files":             "/abs/path/to/More/CamelCase/entries.js"
    "camel-case/entries-and-other/stuff": "/abs/path/to/More/CamelCase/EntriesAndOther/stuff.js"
}
```

Now add `[name]` in your `output.filename` and the entry file directory structure will be reflected in the output
directory.