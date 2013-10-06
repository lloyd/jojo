#!/usr/bin/env node

var path = require('path');
var express = require('express');


var app = express();
app.use(express.static(path.join(process.cwd(), 'static')));
app.listen(8100);
