const fs = require('file-system');

const runThroughPolymer = (polymer) => {
	let polymerArray = polymer.split('');
	let previousChanged = false;
	let newPolymer = polymerArray.reduce((pol, letter, i, array) => {
		if (previousChanged) {
			previousChanged = false;
			return pol;
		}
		let endOfArray = i < array.length - 1;
		let nextLetter = array[i+1];
		if (endOfArray && letter === nextLetter){
			return pol + letter;
		} else if (endOfArray && letter.toUpperCase() === nextLetter.toUpperCase()){
			previousChanged = true;
			return pol;
		} else {
			return pol + letter;
		}
	}, '')
	return newPolymer;
}

const reduce = (polymer, letterToChange) => {
	let polymerArray = polymer.split('');
	return polymerArray.reduce((pol, letter) => {
		return letter.toLowerCase() === letterToChange ? pol : pol + letter;
	}, '')
}

//What's the polymer's length after changes?

const question1 = () => {
	const arr = fs.readFile('./5.txt', (err, data) => {
		let polymer = data.toString(), newPolymer = '';
		let hasChanged = true;
		while (hasChanged) {
			newPolymer = runThroughPolymer(polymer);
			newPolymer !== polymer ? (polymer = newPolymer) : hasChanged = false;
		}
		console.log(`Polymers length at the end is ${newPolymer.length}`)
	})
}

question1();

//After deleting one of the letters, what is the shortest polymer you can get?

const question2 = () => {
	const arr = fs.readFile('./5.txt', (err, data) => {
		let polymer = data.toString(), newPolymer = '', minLength = Infinity, letter = '', hasChanged = true;
		for ( i = 0; i < 26; i++){
			hasChanged = true;
			letter = (i+10).toString(36);
			polymer = reduce(polymer, letter);
			while (hasChanged) {
				newPolymer = runThroughPolymer(polymer);
				newPolymer !== polymer ? (polymer = newPolymer) : hasChanged = false;
			}
			polymer = data.toString();
			if(!hasChanged && newPolymer.length < minLength) {
				minLength = newPolymer.length;
			}
		}
		console.log(`Shortest polymer has a length of ${minLength}`);
	})
}

question2();