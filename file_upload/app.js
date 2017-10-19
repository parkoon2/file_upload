const http = require('http');
const express = require('express');
const app = express();
const path = require('path');


const upload = require('./router/upload.js');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', upload);

http.createServer(app).listen(7777);
