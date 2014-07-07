/*

listen.js - snippet-logstash

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

var events = require('events');
var fs = require('fs');
var http = require('http');
var path = require('path');
var shelljs = require('shelljs');
var SnippetLogstash = require('../index.js');

var test = module.exports = {};

test['should populate process instance handle with ChildProcess object'] = function (test) {
    test.expect(4);
    var snippetLogstash = new SnippetLogstash();
    snippetLogstash.on('exit', function () {
        test.done();
    });
    snippetLogstash.listen(undefined, function (stdin) {
        // indirectly test for ChildProcess object by testing for EventEmitter
        // with stdin, stdout, stderr streams
        test.ok(snippetLogstash.process instanceof events.EventEmitter);
        test.ok(snippetLogstash.process.stdin);
        test.ok(snippetLogstash.process.stdout);
        test.ok(snippetLogstash.process.stderr);
        snippetLogstash.process.kill('SIGINT');
    });
};

test['should call callback with stdin handle to the process'] = function (test) {
    test.expect(1);
    var snippetLogstash = new SnippetLogstash();
    snippetLogstash.on('exit', function () {
        test.done();
    });
    snippetLogstash.listen(undefined, function (stdin) {
        test.strictEqual(stdin, snippetLogstash.process.stdin);
        snippetLogstash.process.kill('SIGINT');
    });
};

test['should emit \'listening\' event with stdin handle to the process'] = function (test) {
    test.expect(1);
    var snippetLogstash = new SnippetLogstash();
    snippetLogstash.on('exit', function () {
        test.done();
    });
    snippetLogstash.on('listening', function (stdin) {
        test.strictEqual(stdin, snippetLogstash.process.stdin);
        snippetLogstash.process.kill('SIGINT');
    });
    snippetLogstash.listen();
};

test['should parse combined-apache-log-plus by default, send to elasticsearch using bulk HTTP POST and emit same data via stdout'] = function (test) {
    test.expect(5);
    var snippetLogstash = new SnippetLogstash();

    var expectedJsonPath = path.normalize(path.join(__dirname, 'data', 'test-apache.json'));
    var expectedJson = fs.readFileSync(expectedJsonPath);

    var elasticsearchMock = http.createServer(function (req, res) {
        if (req.url != '/_bulk' || req.method != 'POST') {
            res.end();
            return;
        }

        var data = "";

        req.on('data', function (chunk) {
            data += chunk.toString('utf8');
        });
        req.on('end', function () {
            data = data.split('\n');

            try {
                var command0 = JSON.parse(data[0]);
                test.equal(command0.index._type, 'logs');
                test.strictEqual(command0.index._id, null);
                test.equal(command0.index._index, 'logstash-2013.12.11');

                test.equal(data[1], expectedJson.toString('utf8'));
            } catch (e) {
                console.error(e);
                test.ok(true);
            }

            snippetLogstash.close();
            elasticsearchMock.close();
            test.done();
        });

        res.writeHead(200);
        res.end();
    });

    var testDataPath = path.normalize(path.join(__dirname, 'data', 'test-apache.log'));
    var testData = fs.createReadStream(testDataPath);

    snippetLogstash.on('listening', function (logstashStdin) {
        testData.pipe(logstashStdin);
    });
    snippetLogstash.on('stdout', function (data) {
        test.equal(data.toString('utf8'), expectedJson.toString('utf8'));
    });

    elasticsearchMock.listen(9200, 'localhost', function () {
        snippetLogstash.listen();
    });

    process.on('SIGINT', function () {
        snippetLogstash.close();
        elasticsearchMock.close();
    });
};