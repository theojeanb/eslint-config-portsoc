/* global QUnit */
'use strict';

const fs = require('fs');
const path = require('path');

const eslint = require('eslint');

const FILES_DIR = path.join(__dirname, 'files');

const BAD_SUFFIX = '-bad.js';
const GOOD_SUFFIX = '-good.js';

const linter = new eslint.CLIEngine({ configFile: 'index.js' });

const files = fs.readdirSync(FILES_DIR);
QUnit.test('there are testing files', assert => {
  assert.notEqual(files.length, 0, 'there should be some test files');
  for (const file of files) {
    assert.ok(file.endsWith(BAD_SUFFIX) || file.endsWith(GOOD_SUFFIX),
      `test files must end with ${BAD_SUFFIX} or ${GOOD_SUFFIX}`);
  }
});

for (const file of files) {
  if (file.endsWith(BAD_SUFFIX)) {
    QUnit.test(`file ${file} should fail linting`, assert => {
      const text = fs.readFileSync(path.join(FILES_DIR, file), 'utf8');
      const report = linter.executeOnText(text);
      const messages = report.results[0].messages;

      assert.notEqual(messages.length, 0, `file ${file} should be bad but lints as good`);
    });
  } else {
    QUnit.test(`file ${file} should be good`, assert => {
      const text = fs.readFileSync(path.join(FILES_DIR, file), 'utf8');
      const report = linter.executeOnText(text);
      const messages = report.results[0].messages;

      assert.equal(messages.length, 0, `file ${file} should be good but has linting errors`);
      if (messages.length > 0) {
        console.log({ file, messages });
      }
    });
  }
}
