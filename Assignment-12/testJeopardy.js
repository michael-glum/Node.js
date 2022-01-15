var jeopardy = require("./jeopardy.js");

var j = new jeopardy();

async function doIt() {
	await j.load();

	let max = j.getLength();
	for (i=0;i<5;i++) {
		let n=Math.floor(Math.random()*max);
		console.log(n,j.get(n));
	}
	console.log("Get list of shows",j.getShows())

	console.log("Get list of topics for 12/3/04",j.getTopics("12/3/04"))

	console.log("get questions for topic 0, show 12/3/04",j.getQuestions("12/3/04",0))
	console.log("get answers for topic 0, show 12/3/04, order of answers should be different",j.getQuestions("12/3/04",0).answers)
	console.log("get answers for topic 0, show 12/3/04, order of answers should be different",j.getQuestions("12/3/04",0).answers)

	console.log("correct answer topic 0, question 0, show 12/3/04",j.checkAnswer("12/3/04",0,0,"China"))
	console.log("wrong answer topic 0, question 0, show 12/3/04",j.checkAnswer("12/3/04",0,0,"Nepal"))


		
}

doIt();
