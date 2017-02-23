/**
 * Created by zane on 11/2/16.
 */

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    MODEL_PATH = "./models/",
    moment = require("moment"),
    Camp = require(MODEL_PATH + "campModel.js"),
    Comment = require(MODEL_PATH + "commentModel.js"),
    User = require(MODEL_PATH + "userModel.js"),
    passport = require("passport"),
    session = require("express-session"),
    localStrategy = require("passport-local"),
    mongoose = require("mongoose"),
    seed = require("./seed"),
    common = require("./common");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/zanecamp");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(session({
    secret: "hello world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.use('/camps',common.isLogin);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seed();

//requiring routes
app.use(require("./routes/camps"));
app.use(require("./routes/comment"));
app.use(require("./routes/user"));

app.listen(3000, function (req, res) {
    console.log("Server has been started...");
});

