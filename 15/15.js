const { question } = require('./15.lib');
const fs = require('file-system');

const runQuestions = () => {
	const arr = fs.readFile('./15.txt', (err, data) => {
		for(let i = 3; ;i++){
			const answer = question(data, i);
			if(answer.elvesWon) {
				console.log(`Elves won with no casualties when their attack was equal to ${i}, their score was ${answer.score}.`)
				break;
			}
		}
	})
}

runQuestions();