var mongoose = require("mongoose");
var userRouter = require("express").Router();
const passport = require("passport");

const passportService = require("../../passport");
const requireLogin = passport.authenticate("local", { session: false });
const auth = require("../auth");

// const User = mongoose.model("User");
const User = require("../../models/User");

//Send User their profile inJERK
userRouter.route("/").get(auth.required, function(req, res, next) {
  console.log(req.payload);
  User.findById(req.payload.sub)
    .then(function(userPayload) {
      if (!userPayload) {
        return res.sendStatus(401);
      }

      return res.json({
        user: userPayload.toJSON(),
        song:
          "HERE I AM ON THE PHONE, GOING DOWN THE ONLY ROAD I'VE BEEN LIVING ON"
      });
    })
    .catch(next);
});

//User login. payload will have user object with email and password
userRouter.route("/login").post(requireLogin, function(req, res, next) {
  //here we'll do our passport auth to check for user in local db
  res.send({
    token: req.user.generateJWT(),
    email: req.user.email
  });
});

//New User Registar endpoint. That will take username, email, passwordy
userRouter.route("/").post(function(req, res, next) {
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  //userpassword????
  user.setPassword(req.body.password);

  user.save(function(err, userPayload) {
    if (err) {
      next(err);
    } else {
      res.json({ user: userPayload.toJSON() });
    }
  });
});

module.exports = userRouter;
