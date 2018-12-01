const fs = require('file-system');

// What is the final frequency if we know the values of fluctuations?

const question = () => {
	fs.readFile('./1.txt', (err, data) => {
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
		console.log('Last frequency: ', answer);
	})
}

question();

// What is the first frequency that we reach twice, considering that
// fluctuations happen periodically with the same set of values? 

// Possible improvement: change array to binary search tree 
const checkArray = (arr, value) => {
	let check = false;
	arr.forEach((element) => {
		if (element === value){
			check = true;
		}
	})
	return check;
}

const question2 = () => {
	fs.readFile('./1.txt', (err, data) => {
		const frequencyChanges = data.toString().split('\n');
		const previousFrequencies = [];
		let accumulator = 0;
		let end = false;
		while(!end){
			const answer = frequencyChanges.some((currentValue) => {
				const sign = currentValue.substr(0,1);
				const value = Number(currentValue.substr(1));
				if (sign === '-') {	
						accumulator -= value;
						if (checkArray(previousFrequencies, accumulator)) {
							end = true;
							return true;
						} else previousFrequencies.push(accumulator);
				} else {
					accumulator += value;
					if (checkArray(previousFrequencies, accumulator)) {
						end = true;
						return true;
					} else previousFrequencies.push(accumulator);
				}
			})
		}
		console.log('First double frequency: ', accumulator);
	})
}

question2();
