// Fetch depencies
const glob = require('glob');
const globBase = require('glob-base');
const path = require('path');

let directories = [];

/**
 * class WebpackEntriesGlobber
 */
class WebpackEntriesGlobber {

    /**
     *
     * @param globs
     * @param globOptions
     * @param pluginOptions_
     * @returns {Function}
     */
    static getEntries(globs, globOptions, pluginOptions_) {

        // Type check pluginOptions_
        if (typeof pluginOptions_ !== 'undefined' && typeof pluginOptions_ !== 'object') {
            throw new TypeError('pluginOptions_ must be an object');
        }

        // Options defaults
        const pluginOptions = Object.assign({
            basename_as_entry_id: false,
            camelcase_to_dashes:  false
        }, pluginOptions_);

        return function () {

            // Check if globs are provided properly
            if (typeof globs !== 'string' && !Array.isArray(globs) && typeof globs !== 'object') {
                throw new TypeError('globOptions must be a string, an array of strings or a array of objects');
            }

            // Check globOptions if provided properly
            if (globOptions && typeof globOptions !== 'object') {
                throw new TypeError('globOptions must be an object');
            }

            // Make entries an array
            if (!Array.isArray(globs) && typeof globs !== 'object') {
                globs = [globs];
            }

            let globbedFiles = {};

            // Map through the globs
            globs.forEach(function (globStringOrObject) {
                let globBaseOptions

                if (typeof globStringOrObject === 'object') {
                    globBaseOptions = globBase(globStringOrObject.globString);
                } else {
                    globBaseOptions = globBase(globStringOrObject);
                }

                // Dont add if its already in the directories
                if (directories.indexOf(globBaseOptions.base) === -1) {
                    directories.push(globBaseOptions.base);
                }

                // Get the globbedFiles
                let files = WebpackEntriesGlobber.getFiles(globStringOrObject, globOptions, pluginOptions);

                // Set the globbed files
                globbedFiles = Object.assign(files, globbedFiles);
            });

            return globbedFiles;
        };
    }

    /**
     * Create webpack file entry object
     * @param globStringOrObject
     * @param globOptions
     * @param pluginOptions
     * @returns {Object}
     */
    static getFiles(globStringOrObject, globOptions, pluginOptions) {
        const files = {};
        let globString;

        if (typeof globStringOrObject === 'object') {
            globString = globStringOrObject.globString;
        } else {
            globString = globStringOrObject;
        }

        const globBaseOptions = globBase(globString);

        glob.sync(globString, globOptions).forEach(function (file) {
            // Format the entryName
            let entryName = path
              .relative(globBaseOptions.base, file)
              .replace(path.extname(file), '')
              .split(path.sep)
              .join('/')

            if (pluginOptions.basename_as_entry_name) {
                entryName = path.basename(entryName);
            }

            if (typeof globStringOrObject === 'object') {
                if (globStringOrObject.namePrefix !== 'undefined' && typeof globStringOrObject.namePrefix === 'string') {
                    entryName = globStringOrObject.namePrefix + entryName;
                }
            }
            if (pluginOptions.camelcase_to_dashes) {
                entryName = entryName
                  .replace(/[A-Z]/g, '-$&')
                  .toLowerCase()
                  .replace(/\/-/g, '/')
                  .replace(/--/g, '-')
                  .replace(/^-/, '');
            }

            // Add the entry to the files obj
            files[entryName] = file;
        });

        return files;
    }

    /**
     * Install Plugin
     * @param {Object} compiler
     */
    apply(compiler) {
        if (compiler.hooks) {
            // Support Webpack >= 4
            compiler.hooks.afterCompile.tapAsync(this.constructor.name, this.afterCompile.bind(this));
        } else {
            // Support Webpack < 4
            compiler.plugin("after-compile", this.afterCompile);
        }
    }

    /**
     * After compiling, give webpack the globbed files
     * @param {Object} compilation
     * @param {Function} callback
     */
    afterCompile(compilation, callback) {
        if (Array.isArray(compilation.contextDependencies)) {
            // Support Webpack < 4
            compilation.contextDependencies = compilation.contextDependencies.concat(directories);
        } else {
            // Support Webpack >= 4
            for (const directory of directories) {
                compilation.contextDependencies.add(directory);
            }
        }
        callback();
    }
}

module.exports = WebpackEntriesGlobber;

