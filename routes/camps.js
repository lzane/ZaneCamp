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
    var tempcamp = req.body.camp;
    tempcamp.author = {
        name: req.user.username,
        id: req.user.id
    };
    
    Camp.create(tempcamp, function (err) {
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

module.exports = route;