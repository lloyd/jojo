#!/usr/bin/env node

var path = require('path');
var http = require('http');
var express = require('express');
var sockets = require('./sockets');

var sessionStore = new express.session.MemoryStore();
var sessionKey = 'jojo';

var app = express();
app.use(express.static(__dirname, 'static'));

sockets.bind(http.createServer(app), sessionStore, sessionKey);

app.listen(8100);
