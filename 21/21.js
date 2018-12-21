const fs = require('file-system');
const { question1, question2 } = require('./21.lib');

const runQuestion = (number) => {
	fs.readFile('./21.txt', (err, data) => {
		if(number === 1){
			const answer = question1(data);
			console.log(`The lowest non-negative integer value after least instructions is ${answer}`);
		}
		if(number === 2){
			const answer = question2(data);
			console.log(`The lowest non-negative integer value after most instructions is ${answer}`);
		}
	})
}

runQuestion(1);
runQuestion(2);