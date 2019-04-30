var express = require('express');
var router = express.Router();
var passport = require('passport');
const url = require('url');
var jwt = require('jsonwebtoken');
var settings = require('../config/settings');

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  function(req, res) {
    if (req.user.success) {
      var token = jwt.sign(req.user.profile.toObject(), settings.secret, { expiresIn: '6d'});

      res.redirect(url.format({
        pathname: 'callback-URL ex. http://localhost:3000',
        query: {
          'success': 'true',
          'token': token,
          'message': req.user.message
        } 
      }));
    } else {
      res.redirect(url.format({
        pathname: 'callback-URL ex. http://localhost:3000',
        query: {
          'success': 'false',
          'message': req.user.message
        } 
      }));
    }
  }
);

module.exports = router;