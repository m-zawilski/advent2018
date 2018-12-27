const fs = require('file-system');
const { question } = require('./17.lib');

const runFirstQuestion = () => {
	fs.readFile('./17.txt', (err, data) => {
		const {answer1, answer2 } = question(data);
		console.log(`${answer1} tiles have been touched by water.`);
		console.log(`${answer2} tiles still contain water after the spring will have finished.`);
	})
}

runFirstQuestion();