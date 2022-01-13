/*
 * scott campbell
 * cse270e
 * winter 2022
 *
 * class to load jeopardy questions
 * questions taken from:
 * 
 *
 * var jeopardy=require("./jeopardy");
 * var questions = new jeopardy();
 * questions.load();	///note, this uses a callback so it will be awhile before questions loaded
 *
 * using promises
 * but if using nodejs you don't need this as the load will have time to run before first call arrives (probably)
 *
 * async function run() {
 *     await questions.load();
 *     console.log(questions.getLength());
 *     }
 *
 */

const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');


class jeopardy {
	constructor() {
		this.questions = [];
		this.shows={};
	}

	/*
	 * read from file jeopardy.csv
	 * */
	load() {
		return new Promise((res,rej) => {
			fs.createReadStream(path.resolve(__dirname, 'jeopardy.csv'))
				.pipe(csv.parse({ headers: false}))
				.on('error', (error) => console.error(error))
				.on('data', (row) => {
					let d={date:row[1],topic:row[3],amount:row[4],question:row[5],answer:row[6],numGuesses:0,numRight:0,answers:[]};
					try {
						let date=row[1];
						let topic=row[3];
						if (this.shows[date] === undefined)
							this.shows[date]= {}
						if (this.shows[date][topic] === undefined)
							this.shows[date][topic] = [];
						this.shows[date][topic].push(d)
						this.questions.push(d)
					} catch (e) {
						d=row[1]
						console.log(this.shows[d])
						process.exit(0);
					}

				})
				.on('end', (rowCount) => res())
		})
	}


	/*
	 * return number of questions
	 * */
	getLength() {
		return this.questions.length;
	}

	/*
	 * get question i assuming it exists
	 * */
	get(i) {
		if (i<0 || i >= this.questions.length)
			return [];
		return this.questions[i];
	}

	//dump all questions to console
	dump() {
		let l = this.questions.length;
		for (let i=0;i<l;i++) 
			console.log(this.questions[i].question);

	}

	/*add person's guess*/
	addAnswer(i,answer) {
		if (i<0 || i >= this.questions.length)
			return 1;
		this.questions[i].answers.push(answer);
		return 0;
	}

	/*
	 * update overall score for question i
	 */
	score(i,rightWrong) {
		if (i<0 || i >= this.questions.length)
			return 1;
		this.questions[i].numGuesses++;
		if (rightWrong==true)
			this.questions[i].numRight++;
		return 0;
	}

	//returns a list of shows
	getShows() {
		return Object.keys(this.shows);
	}

	//returns a list of topics for a given show
	getTopics(show) {
		try {
			return Object.keys(this.shows[show])
		} catch (e) {
			console.log("Error in getTopics",show,e);
			return null
		}
	}

	//returns list of questions for given show/topic
	getQuestions(show,topic) {
		try {
			console.log("getQuestions show topic",show,topic);
			let topics = this.getTopics(show);
			let topicQuestions = this.shows[show][topics[topic]];
			let q = [];
			let a = [];
			for (let i=0;i<topicQuestions.length;i++) {
				q.push(topicQuestions[i].question);
				a.push(topicQuestions[i].answer);
			}
			//scramble answers
			for (let i=0;i<30;i++) {
				let x = Math.floor(Math.random()*a.length);
				let y = Math.floor(Math.random()*a.length);
				let z= a[x];
				a[x] = a[y];
				a[y]=z;
			}
				
			return {questions:q,answers:a};
		} catch (e) {
			console.log("error in getQuestions",e,show,topic);
			return null;
		}
	}

	//see if answer is right.  Answer is full text of answer
	checkAnswer(show,topic,questionNum,answer) {
		try {
			let topics = this.getTopics(show);
			let topicQuestions = this.shows[show][topics[topic]];
			if (answer == topicQuestions[questionNum].answer)
				return "Correct";
			else
				return "Wrong";
		} catch (e) {
			console.log("error in checkAnswer",e,show,topic);
			return null;
		}

	}

	//return random list of question for show/topic
	getRandomQuestions() {
		try {
			let shows = this.getShows();
			let s = Math.floor(Math.random()*shows.length);
			let topics = this.getTopics(shows[s]);
			let t = Math.floor(Math.random()*topics.length);
			let questions = this.getQuestions(shows[s],topics[t]);
			if (questions.length <3)
				return this.getRandomQuestions();
			return questions;
		} catch (e) {
			console.log("getRandom",e);
			return [];
			}
	}

}

module.exports = jeopardy
