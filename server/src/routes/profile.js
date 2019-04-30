var express = require('express');
var router = express.Router();
var passport = require('passport');
var Profile = require("../models/Profile");
var settings = require('../config/settings');
var jwt = require('jsonwebtoken');


router.get('/', function(req, res) {
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
        req.decoded = decoded;

        Profile.findOne({ provider: decoded.provider }, function (err, profile) {
          if (err) return next(err);

          var clone = Object.assign({}, profile);
          delete clone._doc.accessToken;
          clone._doc.success = true;

          res.json(clone._doc);
        });
      }
    });
  } else {
    console.log('Auth token is not supplied');
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
});

router.post('/update', function(req, res) {
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
        req.decoded = decoded;

        Profile.findOne({ provider: decoded.provider }, function (err, profile) {
          if (err) return next(err);

          profile.name = req.body.profile.name;
          profile.displayName = req.body.profile.displayName;
          profile.bio = req.body.profile.bio;

          profile.save()
          .then (data => {
            data.success = true;
            res.send(data);
          }).catch(err => {
            res.status(500).send({
              message: err.message || 'An error occured while updating the profile'
            });
          });
        });
      }
    });
  } else {
    console.log('Auth token is not supplied');
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
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