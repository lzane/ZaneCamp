var express = require("express");
var route = express.Router();
var passport = require("passport");
var User = require("../models/userModel");

//================
// User register login logout
//================
route.get("/register", function (req, res) {
    res.render("user/register");
});


route.post("/register", function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            return res.render('user/register', {errorMessage: err.message});
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/camps");
        })
    });
});

route.get("/login", function (req, res) {
    res.render("user/login");
});


route.post("/login", function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.render("user/login", {loginErrorMessage: info.message})
        }
        req.login(user, function (err) {
            if (err) {
                console.log(err);
            }
            return res.redirect("/camps");
        });
    })(req, res, next);
});

route.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/camps")
});

route.get("*", function (req, res) {
    res.send("No route handled this request!");
});

module.exports = route;