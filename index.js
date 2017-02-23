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
    seed = require("./seed");

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
app.use('/camps',isLogin);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seed();
// Routes
app.get("/camps", function (req, res) {
    Camp.find({}, function (err, camps) {
        if (err) {
            console.log("DB find Error!");
        } else {
            camps.forEach(function (camp) {
                camp.timeFromNow = moment(camp.created).fromNow();
            });
            res.render("camps/camps", {data: camps});
        }
    });
});

app.post("/camps", function (req, res) {
    Camp.create(req.body.camp, function (err) {
        if (err) {
            console.log("DB insert Error!");
        } else {
            res.redirect("/camps");
        }
    });
});


function isLogin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


app.get("/camps/new", function (req, res) {
    res.render("camps/createCamp");
});

app.get("/camps/:id", function (req, res) {
    var id = req.params.id;
    Camp.findById(id).populate("comments").exec(function (err, foundCamp) {
        if (err) {
            res.send("can not find the camp");
        } else {
            res.render("camps/campDetail", {camp: foundCamp});
        }
    });
});

app.post("/camps/:id", function (req, res) {
    var id = req.params.id;
    var comment = req.body.comment;
    Camp.findById(id, function (err, camp) {
        if (err) {
            res.send("can not find the camp to add comment");
        } else {
            Comment.create({
                name: comment.name,
                content: comment.content
            }, function (err, comment) {
                if (err) {
                    res.send("can not create comment");
                } else {
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/camps/" + id);
                }
            });
        }
    });
});

app.get("/camps/:id/edit", function (req, res) {
    var id = req.params.id;
    Camp.findById(id, function (err, foundCamp) {
        if (err) {
            res.send("can not find the camp");
        } else {
            res.render("camps/campEdit", {camp: foundCamp});
        }
    });
});

app.put("/camps/:id", function (req, res) {
    var camp = req.body.camp;
    var id = req.params.id;
    Camp.findByIdAndUpdate(id, camp, function (err, updateCamp) {
        if (err) {
            res.send("can not update camp");
        } else {
            res.redirect("/camps/" + id);
        }
    })
});

app.delete("/camps/:id", function (req, res) {
    var id = req.params.id;
    Camp.findById(id, function (err, camp) {
        if (err) {
            res.send("can not delete camp");
        } else {
            camp.comments.forEach(function (commentID) {
                Comment.findByIdAndRemove(commentID, function (err) {
                    if (err) {
                        res.send("can not delete comments");
                    }
                });
            });
            camp.remove();
            res.redirect("/camps");
        }
    })
});


//================
// User register login logout
//================
app.get("/register", function (req, res) {
    res.render("user/register");
});


app.post("/register", function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            return res.render('user/register', {errorMessage: err.message});
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/camps");
        })
    });
});

app.get("/login", function (req, res) {
    res.render("user/login");
});


app.post("/login", function (req, res, next) {
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

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/camps")
});

app.get("*", function (req, res) {
    res.send("No route handled this request!");
});

app.listen(3000, function (req, res) {
    console.log("Server has been started...");
});

