/*
 * Assignment-12 Jeopardy API
 * cse270e
 * Copyright Michael Glum January 14, 2022
 */

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var fs = require("fs");
var jeopardy = require("./jeopardy");
var questions = new jeopardy();

async function run() {
    await questions.load();
    console.log(questions.getLength());

    
var app = express();
app.use(cookieParser());

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.render("index", {"username" : req.cookies.name});
});

app.post("/", function(req, res) {
    res.cookie('name', req.body.username);
    res.redirect("/shows");
});

app.get("/shows", function(req, res) {
    if (!req.cookies.name) {
        res.redirect("/");
	return;
    }
    var shows = questions.getShows();
    res.render("shows", {"username" : req.cookies.name, "showList" : shows});
});

app.get("/topics/:show(*)", function (req, res) {
    if (!req.cookies.name) {
        res.redirect("/");
	return;
    }
    var showDate = req.params.show;
    var topics = questions.getTopics(showDate);
    if (!topics) {
	res.redirect("/404");
	return;
    }
    res.render("topics", {"username" : req.cookies.name, "show" : showDate,
        "topicList" : topics});
});

app.get("/questions/:mm/:dd/:yy/:topic(*)", function (req, res) {
    if (!req.cookies.name) {
        res.redirect("/");
	return;
    }
    var showDate = "" + req.params.mm + "/" + req.params.dd + "/" + req.params.yy;
    var topicNumber = req.params.topic;
    if (!questions.getQuestions(showDate, req.params.topic)) {
	res.redirect("/404");
	return;
    }
    res.render("questions", {"username" : req.cookies.name, "show" : showDate,
        "topic" : topicNumber});
});

app.get("/thanks", function (req, res) {
    if (!req.cookies.name) {
        res.redirect("/");
	return;
    }
    res.render("thankyou", {"username" : req.cookies.name});
});

app.use(express.json());

app.get("/api/v1/jeopardy/shows", function (req, res) {
    res.json({shows: questions.getShows()});
});

app.get("/api/v1/jeopardy/topics/:show(*)", function (req, res) {
    var topics = questions.getTopics(req.params.show);

    if (!topics) {
        res.status(400);
	res.json({error: "Bad Request"});
	return;
        
    }
    res.json({topics: topics});
});

app.get("/api/v1/jeopardy/questions/:mm/:dd/:yy/:topicNumber", function (req, res) {
    var showDate = "" + req.params.mm + "/" + req.params.dd + "/" + req.params.yy;
    var q = questions.getQuestions(showDate, req.params.topicNumber);
    if (!q) {
        res.status(400);
	res.json({error: "Bad Request"});
	return;
    }
    res.json({questions: q});
});


app.get("/api/v1/jeopardy/check/:show(*)/:topic/:qn/:answer", function (req, res) {
    var result = questions.checkAnswer(req.params.show, req.params.topic,
        req.params.qn, req.params.answer);
    
    if (!result) {
        res.status(400);
	res.json({error: "Bad Request"});
	return;
    }
    res.json({result: result});
});

app.post("/api/v1/jeopardy/check", function (req, res) {
    var result = questions.checkAnswer(req.body.showDate, req.body.topicNum,
    req.body.questionNum, req.body.answer);

    if (!result) {
        res.status(400);
        res.json({error: "Bad Request"});
        return;
    }
    res.json({result: result});
});

app.use(function(req, res) {
  res.render("404");
  res.redirect("/shows");
});


app.listen(3012, function() {
    console.log("app started on port 3012");
});

}run();
