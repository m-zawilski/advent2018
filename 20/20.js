const fs = require('file-system');
const { question } = require('./20.lib');

const runQuestion = () => {
	const arr = fs.readFile('./20.txt', (err, data) => {
		question(data);
	})
}

runQuestion();