var express = require('express');
var route = express.Router(),
    Camp = require('../models/campModel'),
    Comment = require('../models/commentModel');

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
                author: {
                    name: req.user.username,
                    id: req.user.id
                },
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