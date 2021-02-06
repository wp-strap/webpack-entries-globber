const path = require('path');

const WebpackEntriesGlobber = require('..');

module.exports = {
    entry: WebpackEntriesGlobber.getEntries(
        // Globs
        [
            {
                globString: path.resolve(__dirname, 'src/FolderWithLongName/**/*.js'),
                namePrefix: 'prefixed-folder/'
            },
            {
                globString: path.resolve(__dirname, 'src/Second/**/*.js'),
            },
            {
                globString: path.resolve(__dirname, 'src/Third/**/*.js'),
            },
            {
                globString: path.resolve(__dirname, 'src/*.js'),
                namePrefix: 'another-prefixed-folder/'
            }
        ],

        // Glob options
        {},

        // Plugin options
        {
            camelcase_to_dashes: true
        }
    ),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new WebpackEntriesGlobber
    ]
};
