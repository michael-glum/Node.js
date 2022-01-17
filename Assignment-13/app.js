/*
 * Assignment-13 Jeopardy with Mongodb
 * cse270e
 * Copyright Michael Glum January 16, 2022
 */

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var fs = require("fs");

var app = express();
app.use(cookieParser());
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));

var jeopardy = require("./jeopardyModel");
var questions = new jeopardy()
/*async function load() {
	await questions.load();
	console.log("loaded");
}
load();*/


app.get("/", function(req, res) {
    res.render("index.ejs", {username : req.cookies.name});
});

app.post("/", async (req, res) => {
    var name = req.body.username;
    var shows = await questions.getShows();
    res.cookie('name', name);
    res.render("shows.ejs", {username: name, showList: shows});
});


app.get("/shows", async (req, res) => {
    if (!req.cookies.name) {
        res.redirect("/");
	return;
    }
    var shows = await questions.getShows();
    res.render("shows.ejs", {"username" : req.cookies.name, "showList" : shows});
});

app.get("/topics/:show(*)", async (req, res) => {
    if (!req.cookies.name) {
        res.redirect("/");
	return;
    }
    var showDate = req.params.show;
    var topics = await questions.getTopics(showDate);
    if (!topics) {
	res.redirect("/404");
	return;
    }
    res.render("topics", {"username" : req.cookies.name, "show" : showDate,
        "topicList" : topics});
});

app.get("/questions/:mm/:dd/:yy/:topic", async (req, res) => {
    if (!req.cookies.name) {
        res.redirect("/");
	return;
    }
    var showDate = "" + req.params.mm + "/" + req.params.dd + "/" + req.params.yy;
    var topicNumber = req.params.topic;
    var q = await questions.getQuestions(showDate, topicNumber);
    if (!q) {
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

app.get("/api/v1/jeopardy/shows", async (req, res) => {
    var shows = await questions.getShows();
    res.json({shows: shows});
});

app.get("/api/v1/jeopardy/topics/:show(*)", async (req, res) => {
    var topics = await questions.getTopics(req.params.show);

    if (!topics) {
        res.status(400);
	res.json({error: "Bad Request"});
	return;
        
    }
    res.json({topics: topics});
});

app.get("/api/v1/jeopardy/questions/:mm/:dd/:yy/:topicNumber", async(req, res) => {
    var showDate = "" + req.params.mm + "/" + req.params.dd + "/" + req.params.yy;
    var topicNumber = req.params.topicNumber
    var q = await questions.getQuestions(showDate, topicNumber);
    if (!q) {
        res.status(400);
	res.json({error: "Bad Request"});
	return;
    }
    var topics = await questions.getTopics(showDate);
    var a = []
    for (let i = 0; i < q.length; i++) {
	let thisAnswer = await questions.getAnswer(showDate, topics, topicNumber, q, i);
        a.push(thisAnswer);
    }
    for (let i = 0; i < a.length; i++) {
    	if (!a[i]) {
	    res.status(400);
	    res.json({error: "Bad Request"});
	    return;
	}
    }
    res.json({questions: q, answers: a});
});


app.get("/api/v1/jeopardy/check/:mm/:dd/:yy/:tn/:qn/:answer", async (req, res) => {
    var showDate = "" + req.params.mm + "/" + req.params.dd + "/" + req.params.yy;
    var result = await questions.checkAnswer(showDate, req.params.tn,
        req.params.qn, req.params.answer);
    
    if (!result) {
        res.status(400);
	res.json({error: "Bad Request"});
	return;
    }
    res.json({result: result});
});

app.post("/api/v1/jeopardy/check", async (req, res) => {
    var result = await questions.checkAnswer(req.body.showDate, req.body.topicNum,
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


app.listen(3013, function() {
    console.log("app started on port 3013");
});
