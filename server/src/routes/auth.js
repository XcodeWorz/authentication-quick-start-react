var express = require('express');
var router = express.Router();
var passport = require('passport');
var Profile = require("../models/Profile");
var settings = require('../config/settings');
var jwt = require('jsonwebtoken');


router.get('/verify', function(req, res) {
  // The one issue with this code is that it takes the token, so be sure to clear the token on the front end with logging out.
  var token = getToken(req.headers);

  if (token) {
    jwt.verify(token, settings.secret, (err, decoded) => {
      if (err) {
        console.log('error on verify ' + err);
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        console.log('Successfully verified');
        return res.json({
          success: true,
          message: 'Valid Token'
        });
      }
    });
  } else {
    console.log('Auth token was not supplied');
    return res.json({
      success: false,
      message: 'Auth token was not supplied'
    });
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
        return null;
    }
  } else {
    return null;
  }
};

module.exports = router;