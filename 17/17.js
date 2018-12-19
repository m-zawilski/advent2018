const fs = require('file-system');
const { question } = require('./17.lib');

const runFirstQuestion = () => {
	fs.readFile('./17.txt', (err, data) => {
		question(data, 1);
	})
}

runFirstQuestion();