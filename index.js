/**
 * Created by zane on 11/2/16.
 */

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var moment = require("moment");

mongoose.connect("mongodb://localhost/zanecamp");

var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    created: {type: Date, default: Date.now()}
});

var Camp = mongoose.model("Camp", campSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.get("/camps", function (req, res) {
    Camp.find({}, function (err, camps) {
        if (err) {
            console.log("DB find Error!");
        } else {
            res.render("camps", {data: camps});
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
    res.render("createCamp");
});

app.get("/camps/:id", function (req, res) {
    var id = req.params.id;
    Camp.findById(id, function (err, foundCamp) {
        if (err) {
            res.send("can not find the camp");
        } else {
            res.render("campDetail", {camp: foundCamp});
        }
    });
});

app.get("/camps/:id/edit", function (req, res) {
    var id = req.params.id;
    Camp.findById(id, function (err, foundCamp) {
        if (err) {
            res.send("can not find the camp");
        } else {
            res.render("campEdit", {camp: foundCamp});
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
    Camp.findByIdAndRemove(id, function (err) {
        if (err) {
            res.send("can not delete camp");
        } else {
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

