const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const config = require('./secret');
const User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use('local-login', new LocalStrategy({
  
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true 
}, function(req, email, password, done) { 

  
  User.findOne({ email:  email }, function(err, user) {
    
    if (err)
    return done(err);

    
    if (!user)
    return done(null, false, req.flash('loginMessage', 'No user found.')); 

   
    if (!user.comparePassword(password))
    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 

    
    return done(null, user);
  });

}));

passport.use(new FacebookStrategy({
  clientID: '1822403961411397',
  clientSecret: '893a735e3b320c2be4e374edac441660',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
}, function(accessToken, refreshToken, profile, next) {
    User.findOne({ facebookId: profile.id }, function(err, user) {
      if (user) {
        return next(err, user);
      } else {
        var newUser = new User();
        newUser.email = profile._json.email;
        newUser.facebookId = profile.id;
        newUser.name = profile.displayName;
        newUser.photo = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
        newUser.save(function(err) {
          if (err) throw err;
          next(err, newUser);
        });
      }
    });
}));


passport.use(new GoogleStrategy({
  clientID: '881280172470-rg0d3732qs1jui1a0e4u2cfg82bkjbfk.apps.googleusercontent.com',
  clientSecret: '03Vygtb8YRcj5AyIeZQQi0Sj',
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, function(accessToken, refreshToken, profile, next) {
    User.findOne({ googleId: profile.id }, function(err, user) {
      if (user) {
        return next(err, user);
      } else {
        var newUser = new User();
        newUser.email = profile.emails[0].value;
        newUser.googleId = profile.id;
        newUser.name = profile.displayName;
        newUser.photo = profile._json.image.url;
        newUser.save(function(err) {
          if (err) throw err;
          next(err, newUser);
        });
      }
    });
}));

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
}
