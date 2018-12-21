const fs = require('file-system');
const { question1, question2 } = require('./19.lib');

const runQuestion = (number) => {
	fs.readFile('./19.txt', (err, data) => {
		if(number === 1){
			const answer = question1(data);
			console.log(`Question 1: The value of register 0 at the end is ${answer}`);
		}
		if(number === 2){
			const answer = question2(data);
			console.log(`Question 2: The value of register 0 at the end is ${answer}`);
		}
	})
}

runQuestion(1);
runQuestion(2);