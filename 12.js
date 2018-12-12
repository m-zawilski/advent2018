const fs = require('file-system');

const getNote = (line) => {
	return {
		order: line.split(' => ')[0],
		result: line.split(' => ')[1]
	}
}

const getPot = (content, index) => {
	return {
		content: content,
		index: index
	}
}

const match = (pots, i, notes) => {
	const fivePots = pots[i-2].content + pots[i-1].content + pots[i].content + 
										pots[i+1].content + pots[i+2].content;
	let content;
	notes.map((note) => {
		if (fivePots === note.order){
			content = note.result;
		} 
	})
	return getPot(content, pots[i].index);
}

const trimState = (state) => {
	let isFirst = false;
	let trimmedState = [];
	state.map((pot) => {
		if (isFirst) {
			trimmedState.push(pot);
		}
		else if (pot.content === '#'){
			isFirst = true;
			trimmedState.push(pot);
		}
	})
	for(let i = 1; i<=4; i++){
		trimmedState.unshift(getPot('.', trimmedState[0].index-i));
	}
	let length = trimmedState.length;
	while(trimmedState[length-1].content === '#' 
					|| trimmedState[length-2].content === '#'
					|| trimmedState[length-3].content === '#'
					|| trimmedState[length-4].content === '#'){
		trimmedState.push(getPot('.', trimmedState[length-1].index+1));
	  length++;
	}
	return trimmedState;
}

const getNextGeneration = (state, notes) => {
	state = trimState(state);
	const newState = [];
	for(let i=2; i<state.length-2; i++){
		newState.push(match(state, i, notes));
	}
	return newState;
}

const getResult = (pots, initialLength) => {
	return pots.reduce((sum, pot) => {
		return pot.content === '#' ? sum + pot.index : sum;
	}, 0)
}

const checkPeriod = (state, notes, period) => {
	let checkingState = JSON.parse(JSON.stringify(state));
	for(let i = 0; i<period; i++){
		checkingState = getNextGeneration(checkingState, notes);
	}
	const beforeStable = getResult(checkingState);
	for(let i = 0; i<period; i++){
		checkingState = getNextGeneration(checkingState, notes);
	}
	const firstCheck = getResult(checkingState);
	for(let i = 0; i<period; i++){
		checkingState = getNextGeneration(checkingState, notes);
	}
	const secondCheck = getResult(checkingState);
	if(firstCheck-beforeStable === secondCheck-firstCheck){
		return {
			additionAfterStable: secondCheck-firstCheck,
			valueBeforeStable: beforeStable
		}
	} else return null;
}

const findPattern = (state, notes) => {
	let period = 10;
	let addition = 0;
	let found = false;
	while(!found){
		foundAddition = checkPeriod(state, notes, period);
		if(foundAddition){
			found = true;
		} else {
			period*=10;
		}
	}
	return {
		period: period,
		valueBeforeStable: foundAddition.valueBeforeStable,
		additionAfterStable: foundAddition.additionAfterStable
	}
}

const question = (number) => {
	const arr = fs.readFile('./12.txt', (err, data) => {
		const linesOfData = data.toString().split('\n');
		const initialState = linesOfData[0].split(' ')[2].split('').map((pot, i) => {
			return getPot(pot, i);
		});
		const notes = linesOfData.slice(2).map((line) => {
			return getNote(line);
		})
		let state = initialState;
		if (number === 1){
			for(let i = 0; i<20; i++){
				state = getNextGeneration(state, notes);
			}
			const answer = getResult(state);
			console.log(`The sum of the pots after 20 years is ${answer}.`)
		} else if (number === 2) {
			const pattern = findPattern(state, notes);
			const answer = pattern.valueBeforeStable + 
							(50000000000-pattern.period)/pattern.period*pattern.additionAfterStable;
			console.log(`The sum of the pots after 50000000000 years is ${answer}.`)
		}
	});
}

question(1);
question(2);