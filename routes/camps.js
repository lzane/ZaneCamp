var express = require("express");
var route = express.Router();
var Camp = require("../models/campModel");
var moment = require("moment");
var Comment = require("../models/commentModel");

// Routes
route.get("/camps", function (req, res) {
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

route.post("/camps", function (req, res) {
    Camp.create(req.body.camp, function (err) {
        if (err) {
            console.log("DB insert Error!");
        } else {
            res.redirect("/camps");
        }
    });
});



route.get("/camps/new", function (req, res) {
    res.render("camps/createCamp");
});

route.get("/camps/:id", function (req, res) {
    var id = req.params.id;
    Camp.findById(id).populate("comments").exec(function (err, foundCamp) {
        if (err) {
            res.send("can not find the camp");
        } else {
            res.render("camps/campDetail", {camp: foundCamp});
        }
    });
});

route.post("/camps/:id", function (req, res) {
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

route.get("/camps/:id/edit", function (req, res) {
    var id = req.params.id;
    Camp.findById(id, function (err, foundCamp) {
        if (err) {
            res.send("can not find the camp");
        } else {
            res.render("camps/campEdit", {camp: foundCamp});
        }
    });
});

route.put("/camps/:id", function (req, res) {
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

route.delete("/camps/:id", function (req, res) {
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

module.exports = route;