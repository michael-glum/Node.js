/*
 * Scott Campbell
 * jeopardy game.js
 * cse270e
 * winter 2022
 */

console.log("loaded");

let qn=0;
let questions={};
let numPlayed=0;
let numRight=0;

//display list of possible ansers and set oncick
function displayAnswers() {
    for (let i=0;i<answers.length;i++) {
	$("#answers >tbody:last-child").append("<tr><td onclick='answer(" + i + ")'>"+answers[i][0]+"</td></tr");    }

}

//called when answer clicked
function answer(an) {
    console.log("answered" + an);
    //call server and check
    $.ajax({
	method: 'post',
	url: "/api/v1/jeopardy/check",
	data: {showDate:showDate,topicNum:topicNum,questionNum:qn-1,answer:answers[an][0]},
	dataType: 'json'

    }).done((data) => {
	console.log("answer",data);
	//display question one
	numPlayed++;
	if (data.result == "Correct")
	    numRight++;
	$("#correct").html(data.result + "<br>Your Answer: " + answers[an][0])
	$("#numPlayed").html(numPlayed)
	$("#numRight").html(numRight)
	displayQuestion()
    });

}

function displayQuestion() {
    if (qn >= questions.length) {
	$("#playAgain").show();
	$("#answers").hide();
	return;
    }

    $("#question").html(questions[qn]);
    qn=qn+1;
    console.log("question num",qn);
}

$(document).ready(() => {
    $("#playAgain").hide();
    console.log("ready");
    //get questions
    $.ajax({
	url:"/api/v1/jeopardy/questions/" + showDate + "/" + topicNum,
	data: "json"
    }).done((data) => {
	//display question one
	questions = data.questions;
	answers = data.answers;
	displayQuestion();
	displayAnswers();
    });
});

