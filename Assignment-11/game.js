/*
 * scott campbell
 * cse270e
 * nodejs
 * assignment-11
 * Play simple version of Jeopardy calling random categories
 * */


var jeopardy = require("./jeopardy.js");
const readline = require("readline");

//readline creates the ability to read from keyboard
const rl = readline.createInterface({input:process.stdin,output:process.stdout});

var j = new jeopardy();


//uses promises to return answer from keyboard
function getUserInput(prompt) {
	return new Promise((res,rej) => {
		rl.question(prompt+" ",(answer) => {
			res(answer);
		})
	})
}


//so that all the answers are not in order, scramble them into a new object
function scramble(q) {
	let newq=JSON.parse(JSON.stringify(q));	//really slick way of cloing objects

	//now mix them up
	for (let i=0;i<30;i++) {
		let a = Math.floor(Math.random()*q.length);
		let b = Math.floor(Math.random()*q.length);
		t=newq[a];
		newq[a]=newq[b];
		newq[b] = t;
	}
	return newq;
}



//display possible answers
function printAnswers(q) {
	console.log("\npossible answers");
	//scramble them
	for (let i=0;i<q.length;i++) {
		console.log(i,q[i].answer);
	}
}

//main function of game play.
async function doIt() {
	await j.load();
	let shows = j.getShows();

	right=0;
	wrong=0;
	//keep playing until user says stop
	while(true) {
		console.log("\nWelcome to simplified Jeopardy, select the correct answer for each question\n");
		let showNum = Math.floor(Math.random()*shows.length);
		//get topics
		let topics = j.getTopics(shows[showNum])
		console.log("Pick a topic");
		for (i=0;i<topics.length;i++) {
			console.log(i,topics[i]);
		}
		let topicNum = await getUserInput("pick a topic ");

		let q = j.getQuestions(shows[showNum],topicNum);
		if (q.length <3)	//hack to keep questions with few entries from being played
			continue;

		//scramble answers
		scrambledAnswers = scramble(q);
		//now play, ask each question
		for (i=0;i<q.length;i++) {
			printAnswers(scrambledAnswers);
			let ans="";
			//get a valid answer
			while(true) {
				let inans = await getUserInput("\nAnswer this Question\n" + q[i].question + "   ???");
				if (inans == "q")
					process.exit(-1);
				ans = parseInt(inans);
				console.log("ans",ans);
				if (isNaN(ans) || ans <0 || ans>=q.length) {
					console.log("Invalid selection");
				}
				else
					break;
			}
			//now see if they answered correctly
			if (scrambledAnswers[ans].answer == q[i].answer)
			{
				console.log("\nRight");
				right++;
			}
			else
			{
				console.log("\nwrong");
				wrong++;
			}
		}


		//display overall score and see if they want to play again
		console.log("\n You have " + right + " right and " + wrong + " wrong\n");


		while(true) {
			let answer = await getUserInput("Play again (Y/N)");
			if (answer == "N" || answer == "n")
				process.exit(0);
			if (answer == "Y" || answer == "y")
				break;
		}

	}
}

doIt();
