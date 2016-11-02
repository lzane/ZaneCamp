/**
 * Created by zane on 11/2/16.
 */

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var data = [{
    name: "Kalen Emsley",
    image: "https://images.unsplash.com/44/C3EWdWzT8imxs0fKeKoC_blackforrest.JPG?dpr=1.2000000476837158&auto=compress,format&fit=crop&w=1199&h=899&q=80&cs=tinysrgb&crop="
    },
    {
        name: "Felix Russell-Saw",
        image: "https://images.unsplash.com/reserve/Hxev8VTsTuOJ27thHQdK_DSC_0068.JPG?dpr=1.2000000476837158&auto=compress,format&fit=crop&w=1199&h=803&q=80&cs=tinysrgb&crop="
    },
    {
        name: "E.T.",
        image: "https://images.unsplash.com/photo-1472152083436-a6eede6efad9?dpr=1.100000023841858&auto=compress,format&fit=crop&w=1199&h=801&q=80&cs=tinysrgb&crop="
    },
    {
        name: "Felix Russell-Saw",
        image: "https://images.unsplash.com/reserve/Hxev8VTsTuOJ27thHQdK_DSC_0068.JPG?dpr=1.2000000476837158&auto=compress,format&fit=crop&w=1199&h=803&q=80&cs=tinysrgb&crop="
    },
    {
        name: "E.T.",
        image: "https://images.unsplash.com/photo-1472152083436-a6eede6efad9?dpr=1.100000023841858&auto=compress,format&fit=crop&w=1199&h=801&q=80&cs=tinysrgb&crop="
    },
    {
        name: "Felix Russell-Saw",
        image: "https://images.unsplash.com/reserve/Hxev8VTsTuOJ27thHQdK_DSC_0068.JPG?dpr=1.2000000476837158&auto=compress,format&fit=crop&w=1199&h=803&q=80&cs=tinysrgb&crop="
    },
    {
        name: "E.T.",
        image: "https://images.unsplash.com/photo-1472152083436-a6eede6efad9?dpr=1.100000023841858&auto=compress,format&fit=crop&w=1199&h=801&q=80&cs=tinysrgb&crop="
    }];


app.get("/showCamp", function (req, res) {
    res.render("showCamp", {data: data});
});

app.post("/showCamp",function (req, res) {
    var receive_date = req.body;
    data.push(receive_date);
    res.redirect("/showCamp");
});

app.get("/createcamp", function (req, res) {
   res.render("createCamp");
});

app.get("*",function (req, res) {
   res.send("No route handled this request!");
});

app.listen(3000, function (req, res) {
    console.log("Server has been started...");
});

