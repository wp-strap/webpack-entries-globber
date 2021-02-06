const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Output', () => {
    it('FolderWithLongName/FileWithLongName.js must be dashed and non-camelcase', () => {
        assert.equal(fs.existsSync(path.resolve(__dirname, '../dist/folder-with-long-name/file-with-long-name.js')), true);
    });
    it('FolderWithLongName/Sub-Folder/AnotherFileWithCamelCase.js must be dashed and non-camelcase', () => {
        assert.equal(fs.existsSync(path.resolve(__dirname, '../dist/folder-with-long-name/sub-folder/another-file-with-camel-case.js')), true);
    });
});
