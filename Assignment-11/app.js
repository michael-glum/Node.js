/*
 * Assignment-11 Jeopardy API
 * cse270e
 * Copyright Michael Glum January 13, 2022
 */

var express = require("express");
var jeopardy = require("./jeopardy");
var questions = new jeopardy();


async function run() {
    await questions.load();
    console.log(questions.getLength());
}
run();
    
app = express();

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

app.get("/api/v1/jeopardy/questions/:show(*)/:topic", function (req, res) {
    var q = questions.getQuestions(req.params.show, req.params.topic);

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

app.listen(3011, function() {
    console.log("app started on port 3011")
});
