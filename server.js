const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    routers = require('./routes/routes.js');
require('./db/mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routers);

app.use('/list', express.static(path.join(__dirname, 'html/index.html')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/public', express.static(path.join(__dirname, 'public')));

const server = app.listen(3001, () => {
    console.log('listening on port %s...', server.address().port);
});