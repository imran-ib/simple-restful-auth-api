const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
require("dotenv").config();

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 60
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 60
  },
  cart: {
    type: Array,
    default: []
  },
  history: {
    type: Array,
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  }
});

// ────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: H A S I N G   P A S S W O R D : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
UserSchema.pre("save", function(next) {
  // ─── USER IS EQUAL TO "THIS" ──────────────────────────────────────────────────────
  var user = this;
  // ─── IF USER IS CHANGING THE PASSWORD WE WILL HASH IT ───────────────────────────
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return next(err);
      // ─── GET USER PASSWORD AND HASH IT ──────────────────────────────────────────────
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        // Store hash in your password DB.
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── II ──────────
//   :::::: C R E A T E   A   M E T H O S   T H A T   W I L L   T A K E   U S E R   P A S S W O R D   A N D   C A L L B A C K : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// we will be calling this function in login(post) route and we will pass password that user enters
UserSchema.methods.comparePasswrod = function(candidatePassword, cb) {
  // compare password with
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── III ──────────
//   :::::: A F T E R   C H E C K I N G   P A S S W O R D   W E   W I L L   G E N E R A T E   T O C K E N : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// we will be calling this function in login(post) route and we will pass password that user enters
UserSchema.methods.generateTocken = function(cb) {
  var user = this;
  // we will use user id and SECRETE keyword to generate token
  var token = jwt.sign(user._id.toHexString(), process.env.SECRET);
  // we create a new field in user collection in db
  user.token = token;
  // save user
  user.save(function(err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

//
// ──────────────────────────────────────────────── III ──────────
//   :::::: A U T H : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//

UserSchema.statics.findByToken = function(token, cb) {
  var user = this;
  // verify token with jwt package
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    //jwt will give back user id as decoded
    // so we find user with id and token
    // token is comming from auth middleware

    user.findOne({ _id: decoded, token: token }, function(err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = { User };
