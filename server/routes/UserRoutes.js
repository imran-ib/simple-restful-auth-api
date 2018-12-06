const express = require("express");
const router = express.Router();

const { User } = require("../models/userModel");
const { auth } = require("../middleware/auth");

// ──────────────────────────────────────────────── I ──────────
//   :::::: A U T H : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//

router.get("/auth", auth, (req, res) => {
  // if everything went ok in auth middleware let the user in
  res.status(200).json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    role: req.user.rol,
    history: req.user.history,
    cart: req.user.cart,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    fullName: req.user.firstName + " " + req.user.lastName
  });
});

// ──────────────────────────────────────────────────────── II ──────────
//
//   :::::: R E G I S T E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  let user = new User(req.body);
  try {
    let newlyCreatedUser = await user.save();
    return res.status(200).json({ registerSuccess: true });
  } catch (error) {
    return res.json({ registerSuccess: false, error });
  }
});

//
// ────────────────────────────────────────────────── III ──────────
//   :::::: L O G I N : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//

router.post("/login", async (req, res) => {
  //find userByEmail if exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ loginSucess: false, message: "No User Foud" });
  }
  //Check Password
  // method to check password is defined in user schema
  user.comparePasswrod(req.body.password, (err, isMatch) => {
    // if password don't match
    if (!isMatch)
      return res.json({ loginSucces: false, message: "Wrong Password" });

    // if password match we will generate a tocken
    user.generateTocken((err, user) => {
      if (err) return res.status(400).send(err);
      // if everything goes ok then we will store the token as cookie
      res
        .cookie("w_auth", user.token)
        .status(200)
        .json({ loginSucces: true });
    });
  });
});

//
// ──────────────────────────────────────────────────── IV ──────────
//   :::::: L O G O U T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
// user should only be able to logout if they are authenticated
router.get("/logout", auth, (req, res) => {
  // find user were id is equal to auth user id and remove token
  User.findByIdAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    });
  });
});

module.exports = router;
