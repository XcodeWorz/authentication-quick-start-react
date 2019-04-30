var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var CORS = require('cors');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var settings = require('./src/config/settings');

const Auth = require("./src/routes/auth");
const AuthGoogle = require("./src/routes/auth.google");
const AuthTwitch = require("./src/routes/auth.twitch");
const Profile = require("./src/routes/profile");

const uri = settings.mongoConnectionString

mongoose.Promise = require('bluebird');
mongoose.connect(uri, { promiseLibrary: require('bluebird'), useNewUrlParser: true })
    .then(() => { console.log('mongoose connection successful.')})
    .catch((err) => {console.error(err)});

app.use(logger('dev'));
app.use(CORS());
app.use(express.static('public'));

app.use(passport.initialize());
require("./src/config/passport");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/api/profile', Profile);
app.use('/api/auth/', Auth);
app.use('/api/auth/google', AuthGoogle);
app.use('/api/auth/twitch', AuthTwitch);

app.get('/api', function(req, res) {
    res.sendFile(path.join(__dirname + '/src/views/index.html'));
});

var server = app.listen(settings.port, function() {
    console.log('Server running on port ' + settings.port);
});

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    process.exit(1);
});
