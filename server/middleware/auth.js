const { User } = require("../models/userModel");

let auth = (req, res, next) => {
  // get token from cookies
  let token = req.cookies.w_auth;
  // find the user with correct token
  // this is custom method 'findByToken' defined in user schema
  User.findByToken(token, (err, user) => {
    // all the megic of finding token is happeing in user schema in findByToken method
    if (err) throw err;
    // no user ,  meaning token is invalid
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });

    // if token is valid
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
