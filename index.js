/*

index.js: snippet-logstash

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
var path = require('path');
var shelljs = require('shelljs');
var spawn = require('child_process').spawn;
var util = require('util');

var TEMP_DIR = shelljs.tempdir();

var DEFAULT_CONFIG_FILE_PATH = path.normalize(
        path.join(__dirname, 'config', 'combined-apache-log-plus.conf'));
var LOGSTASH_HOME = path.normalize(path.join(__dirname, 'logstash-1.4.2'));

/*
  * `options`:
    * `configFilePath`: _String_
        _(Default: snippet-logstash/config/combined-apache-log-plus.conf)_
        The path to Logstash configuration file.
    * `executable`: _String_ _(Default: LOGSTASH_HOME/bin/logstash)_ The path to
        Logstash executable.
*/
var SnippetLogstash = module.exports = function SnippetLogstash(options) {
    var self = this;
    events.EventEmitter.call(self);

    options = options || {};

    self.configFilePath = options.configFilePath || DEFAULT_CONFIG_FILE_PATH;
    self.executable = options.executable || LOGSTASH_HOME + '/bin/logstash';

    self.process = null;

    // make sure we kill the child process if we exit
    self.onSIGINT = function () {
        if (self.process) self.process.kill('SIGINT');
    };
    process.on('SIGINT', self.onSIGINT);
};

util.inherits(SnippetLogstash, events.EventEmitter);

/*
  * `callback`: _Function_ _(Default: undefined)_ `function (code, signal) {}`
      Optional callback to call once the Logstash process is stopped.
*/
SnippetLogstash.prototype.close = function close(callback) {
    var self = this;

    self.process.on('exit', function (code, signal) {
        callback ? callback(code, signal) : undefined;
    })
    self.process.kill('SIGINT');
};

/*
  * `callback`: _Function_ _(Default: undefined)_ `function (processObject) {}`
      Optional callback to call once the Logstash process is started.
*/
SnippetLogstash.prototype.listen = function listen(callback) {
    var self = this;

    self.process = spawn(self.executable, ['-f', self.configFilePath]);

    self.process.stdout.on('data', function (data) {
        self.emit('stdout', data);
    });
    self.process.stderr.on('data', function (data) {
        self.emit('stderr', data);
    });
    self.process.on('exit', function (code, signal) {
        self.process = null;
        self.emit('exit', code, signal);
    });

    // since Logstash will wait for input on stdin and that will be buffered,
    // we can say that we are listening already even if the process isn't fully
    // "up" yet...
    self.emit('listening', self.process.stdin);
    callback ? callback(self.process.stdin) : undefined;
};