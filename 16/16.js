const { question1, question2discovery, question2 } = require('./16.lib');
const fs = require('file-system');

const runFirstQuestion = () => {
	const arr = fs.readFile('./16a.txt', (err, data) => {
		const answer = question1(data);
		console.log(`There are ${answer} samples which match 3 or more opcodes.`)
	})
}

const runSecondQuestion = () => {
	fs.readFile('./16a.txt', (err, data) => {
		const discoveredCodes = question2discovery(data);
		fs.readFile('./16b.txt', (err, data) => {
			const answer = question2(data, discoveredCodes);
			console.log(`Test program results in ${answer}.`)
		})
	})
}

runFirstQuestion();

runSecondQuestion();