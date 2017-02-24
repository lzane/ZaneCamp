var express = require('express');
var route = express.Router(),
    Camp = require('../models/campModel'),
    Comment = require('../models/commentModel'),
    common = require('../common');

route.post("/camps/:id",common.isLogin,function (req, res) {
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

route.get("/camps/:id/comment/:comment_id",[common.isLogin,common.isCommentAuthor], function (req, res) {
    Comment.findById(req.params.comment_id,function (err, comment) {
        if (err) {
            return res.redirect("back");
        }
        if (comment) {
            res.render("camps/editComment",{camp_id: req.params.id , comment: comment});
        }else{
            return res.redirect("back");
        }
    });
});

route.put("/camps/:id/comment/:comment_id",[common.isLogin,common.isCommentAuthor], function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, comment) {
        if (err) {
            return res.redirect("back");
        }
        res.redirect("/camps/"+req.params.id);
    })
});


route.delete("/camps/:id/comment/:comment_id",[common.isLogin,common.isCommentAuthor], function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function (err, comment) {
        if (err) {
            return res.redirect("back");
        }
        res.redirect("/camps/"+req.params.id);
    })
});


module.exports = route;