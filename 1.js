const fs = require('file-system');

function question() {
	fs.readFile('./1a.txt', (err, data) => {
		const frequencyChanges = data.toString().split('\n');
		const answer = frequencyChanges.reduce((acc, currentValue) => {
			const sign = currentValue.substr(0,1);
			const value = Number(currentValue.substr(1));
			if (sign === '-') {
				return acc -= value;
			} else {
				return acc += value;
			}
		}, 0)
		console.log(answer);
	})
}

question();
