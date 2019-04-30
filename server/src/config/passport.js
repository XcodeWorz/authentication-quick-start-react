var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitchStrategy = require('passport-twitch').Strategy;
var User = require('../models/Profile');
var settings = require('./settings');
var jwt = require('jsonwebtoken');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy(
  {
    clientID: 'google_client_id',
    clientSecret: 'google_client_secret',
    callbackURL: 'google_callback_url',
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    User.findOne({ provider: 'google-' + profile.id }, function(err, user) {
      if (err) return next(err);

      // Need to find if an email exists but on another account sync
      console.log(' --- ');
      console.log(profile);
      console.log(user);

      if (!user) {
        // Need to find if an email exists but on another account sync
        User.findOne({ email: profile.emails[0].value }, function(err, user) {
          if(!user) {
            let newUser = new User({
              email: profile.emails[0].value,
              name: profile.name.givenName + ' ' + profile.name.familyName,
              displayName: profile.displayName,
              bio: '',
              macros: [],
              accessToken: accessToken,
            });
            newUser.provider.push('google-' + profile.id);
            
            done(null, { profile: newUser, message: 'Created a new account with google.', success: true });
    
            newUser.save()
            .then (data => {
              done(null, data);
            }).catch(err => {
              console.log(err);
              done(err, null);
            })
          } else {
            // if there is a token then add the account
            var cookies = parseCookies(req);
            var token = null;
            if (typeof cookies['accesstoken'] !== 'undefined'){
              token = cookies['accesstoken'];
            }

            if (token) {
              jwt.verify(token, settings.secret, (err, decoded) => {
                if (err) {
                  console.log(err);
                  done(null, { message: 'Account exists with Twitch login.', success: false });
                } else {
                  req.decoded = decoded;

                  User.findOne({ provider: { $all: [decoded.provider] } }, function (err, user) {
                    user.provider.push('google-' + profile.id);

                    user.save()
                    .then (data => {
                      done(null, { profile: data, message: 'Linked Google to the account.', success: true });
                    }).catch(err => {
                      console.log(err);
                      done(null, { message: err, success: false });
                    })
                  });
                }
              });
            } else {
              console.log('Auth token is not supplied');
              done(null, { message: 'Auth token is not supplied', success: false });
            }
          }
        });
      } else {
        user.accessToken = accessToken;
        
        done(null, { profile: user, message: 'Logged in with google.', success: true });

        user.save()
        .then (data => {
          done(null, data);
        }).catch(err => {
          console.log(err);
          done(err, null);
        });
      }
    });
  }
));

passport.use(new TwitchStrategy(
  {
    clientID: 'twitch-client-id',
    clientSecret: 'twitch-client-secret',
    callbackURL: "twitch-callback",
    scope: "user_read",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    User.findOne({ provider: { $all: ['twitch-' + profile.id] } }, function(err, user) {
      // check for a single value within an array: { provider: { $all: ['twitch'] } }
      if (err) return next(err);

      if (!user) {
        // Need to find if an email exists but on another account sync
        User.findOne({ email: profile.email }, function(err, user) {
          if(!user) {
            let newUser = new User({
              email: profile.email,
              name: profile.username,
              displayName: profile.displayName,
              bio: '',
              macros: [],
              accessToken: accessToken,
            });
            newUser.provider.push('twitch-' + profile.id);
    
            done(null, { profile: newUser, message: 'Created a new account with twitch.', success: true });
    
            newUser.save()
            .then (data => {
              done(null, data);
            }).catch(err => {
              console.log(err);
              done(null, { error: err, success: false });
            })
          } else {
            // if there is a token then add the account
            var cookies = parseCookies(req);
            var token = null;
            if (typeof cookies['accesstoken'] !== 'undefined'){
              token = cookies['accesstoken'];
            }
            
            if (token) {
              jwt.verify(token, settings.secret, (err, decoded) => {
                if (err) {
                  console.log(err);
                  done(null, { message: 'Account exists with Google login.', success: false });
                } else {
                  req.decoded = decoded;

                  User.findOne({ provider: { $all: [decoded.provider] } }, function (err, user) {
                    user.provider.push('twitch-' + profile.id);

                    user.save()
                    .then (data => {
                      done(null, { profile: data, message: 'Linked Twitch to the account.', success: true });
                    }).catch(err => {
                      console.log(err);
                      done(null, { message: err, success: false });
                    })
                  });
                }
              });
            } else {
              console.log('Auth token is not supplied');
              done(null, { message: 'Auth token is not supplied', success: false });
            }
          }
        });
      } else {
        user.accessToken = accessToken;
        
        done(null, { profile: user, message: 'Logged in with twitch.', success: true });

        user.save()
        .then (data => {
          done(null, data);
        }).catch(err => {
          console.log(err);
          done(null, { message: err, success: false });
        });
      }
    });
  }
));

function parseCookies(request) {
  var list = {},
      rc = request.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}