var Camp = require("./models/campModel");
var Comment = require("./models/commentModel");
var common = {};

common.isLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

common.isCampAuthor = function (req, res, next) {
    var id = req.params.id;
    Camp.findById(id, function (err, camp) {
        if (err) {
            console.log("can not find the camp");
            return res.redirect("back");
        }
        if (camp.author.id.equals(req.user.id)) {
            next()
        } else {
            return res.redirect("back");
        }
    });
};

common.isCommentAuthor = function (req, res, next) {
    var id = req.params.comment_id;
    Comment.findById(id, function (err, comment) {
        if (err) {
            return res.redirect("back");
        }
        if (comment.author.id.equals(req.user.id)) {
            next();
        } else {
            return res.redirect("back");
        }
    })
};

module.exports = common;