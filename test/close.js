/*

close.js - snippet-logstash

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

var SnippetLogstash = require('../index.js');

var test = module.exports = {};

test['should set process instance handle to null'] = function (test) {
    test.expect(1);
    var snippetLogstash = new SnippetLogstash();
    snippetLogstash.on('exit', function (code, signal) {
        test.strictEqual(snippetLogstash.process, null);
        test.done();
    });
    snippetLogstash.listen(undefined, function () {
        snippetLogstash.close();
    });
};

test['should emit exit with code and signal when process instance terminates'] = function (test) {
    test.expect(2);
    var snippetLogstash = new SnippetLogstash();
    snippetLogstash.on('exit', function (code, signal) {
        test.strictEqual(code, null);
        test.equal(signal, 'SIGINT');
        test.done();
    });
    snippetLogstash.listen(undefined, function () {
        snippetLogstash.close();
    });
};

test['should call callback with code and signal when process terminates'] = function (test) {
    test.expect(2);
    var snippetLogstash = new SnippetLogstash();
    snippetLogstash.listen(undefined, function () {
        snippetLogstash.close(function (code, signal) {
            test.strictEqual(code, null);
            test.equal(signal, 'SIGINT');
            test.done();
        });
    });
};