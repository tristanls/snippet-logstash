/*

new.js - snippet-logstash

The MIT License (MIT)

Copyright (c) 2014 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var shelljs = require('shelljs');
var SnippetLogstash = require('../index.js');

var TEMP_DIR = shelljs.tempdir();

var test = module.exports = {};

test['SnippetLogstash should have default executable path'] = function (test) {
    test.expect(1);
    var snippetLogstash = new SnippetLogstash();
    test.ok(snippetLogstash.executable);
    test.done();
};

test['SnippetLogstash should have default configFilePath'] = function (test) {
    test.expect(1);
    var snippetLogstash = new SnippetLogstash();
    test.ok(snippetLogstash.configFilePath);
    test.done();
};

test['SnippetLogstash should not have process instance handle'] = function (test) {
    test.expect(1);
    var snippetLogstash = new SnippetLogstash();
    test.ok(!snippetLogstash.process);
    test.done();
};