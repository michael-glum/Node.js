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
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/jeopardy");
var jSchema = mongoose.Schema({
    showDate: {type: String, required:true},
    topic: {type: String, required:true},
    question: {type: String, required:true},
    answer: {type: String, required:true}
})
const question = mongoose.model("question", jSchema);
class jeopardy {
	constructor() {
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
			var instance = new question({
			    showDate:row[1],
			    topic:row[3],
			    question:row[5],
			    answer:row[6]});
			instance.save(function(err,data) {
			// console.log("error on save", err, data);
			});
		    } catch(e) {
		        console.log("Error",e);
			provess.exit(0);
		    }
	        })
		.on('end',(rowCount) => {console.log("done loading");res()})
	})
    }

	count(f) {
		console.log("in function count");
		return new Promise((res, rej) => {
			questions.countDocuments({num: {$gt: f}}, function(err, count) {
				if (err) {
					rej(err);
				} else {
					res(count);
				}
			});
		});
	};

	/*
	 * get question i assuming it exists
	 * */
	get(i) {
		if (i<0 || i >= this.question.length)
			return [];
		return this.question[i];
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
		return new Promise((res, rej) => {
			question.distinct('showDate', (err, result) => {
				if (err) {
					rej(err);
				} else {
					res(result);
				}
			});
		});
	}

	//returns a list of topics for a given show
	getTopics(show) {
		return new Promise((res, rej) => {
			question.distinct('topic', {showDate: show}, (err, result) => {
				if (err) {
					rej(err);
				} else {
					res(result);
				}
			});
		});
	}

	//returns list of questions for given show/topic
	async getQuestions(show,topic) {
		var topics = await this.getTopics(show);
		return new Promise((res, rej) => {
			question.distinct('question', {showDate: show, topic: topics[topic]}, (err, result) => {
				if (err) {
					console.err(err);
					rej(err);
				} else {
					res(result);
				}
			});
		});
	}

	async getAnswer(show,topics,topic,q, qn) {
		return new Promise((res, rej) => {
			question.distinct('answer', {showDate: show, topic: topics[topic],
				question: q[qn]}, (err, result) => {
				if (err) {
					console.err(err);
					rej(err);
				} else {
					res(result);
				}
			});
		});
	}

	//see if answer is right.  Answer is full text of answer
	async checkAnswer(show,topic,qn,answer) {
		let topics = await this.getTopics(show);
		let q = await this.getQuestions(show, topic);
		return new Promise((res, rej) => {
			question.distinct('answer', {showDate: show, topic: topics[topic],
				question: q[qn]}, (err, result) => {
				if (err) {
					console.err(err);
					rej(err);
				} else {
					if (result == answer) {
						res("Correct");
					} else {
						res("Incorrect");
					}
				}
			});
		});
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
