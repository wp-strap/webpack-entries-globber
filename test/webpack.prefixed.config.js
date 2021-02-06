const path = require('path');

const WebpackEntriesGlobber = require('..');

module.exports = {
    entry: WebpackEntriesGlobber.getEntries(
        // Globs
        [
            {
                globString: path.resolve(__dirname, 'src/**/*.js'),
                namePrefix: 'prefixed-folder/'
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
