const fs = require('file-system');

const checkArray = (arr, value) => {
			console.log(value);
	arr.forEach((element) => {
		if (element === value){
			return true;
		}
	});
	return false;
}

const question = () => {
	fs.readFile('./1.txt', (err, data) => {
		const frequencyChanges = data.toString().split('\n');
		const previousFrequencies = [];
		const answer = frequencyChanges.reduce((acc, currentValue) => {
			const sign = currentValue.substr(0,1);
			const value = Number(currentValue.substr(1));
			if (sign === '-') {
				acc -= value;
				checkArray(previousFrequencies, acc) ? 1 : previousFrequencies.push(acc);
				return acc;
			} else {
				acc += value;
				checkArray(previousFrequencies, acc) ? 1 : previousFrequencies.push(acc);
				return acc;
			}
		}, 0)
		console.log(previousFrequencies);
		console.log('Last frequency: ', answer);
	})
}

question();

// dodaj liczbę do array
// sprawdź array
