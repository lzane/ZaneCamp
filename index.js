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
    mongoose = require("mongoose"),
    seed = require("./seed");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/zanecamp");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

seed();

// Routes
app.get("/camps", function (req, res) {
    Camp.find({}, function (err, camps) {
        if (err) {
            console.log("DB find Error!");
        } else {
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

app.get("*", function (req, res) {
    res.send("No route handled this request!");
});

app.listen(3000, function (req, res) {
    console.log("Server has been started...");
});

