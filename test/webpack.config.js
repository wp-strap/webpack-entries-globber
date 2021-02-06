const path = require('path');

const WebpackEntriesGlobber = require('..');

module.exports = {
    entry: WebpackEntriesGlobber.getEntries([path.resolve(__dirname, 'src/**/*.js')]),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new WebpackEntriesGlobber
    ]
};
