class recipeNode {
	constructor(value){
		this.value = value;
		this.previous = null;
		this.next = null;
	}

	appendNode(value, list){
		let newNode = new recipeNode(value);
		this.next.previous = newNode;
		newNode.previous = this;
		newNode.next = this.next;
		this.next = newNode;
		list.length=list.length+1;
	}
}

class LinkedList {
	constructor(firstValue, secondValue) {
		let firstNode = new recipeNode(firstValue);
		let secondNode = new recipeNode(secondValue);
		this.head = firstNode;
		this.length = 2;
		firstNode.next = secondNode;
		firstNode.previous = secondNode;
		secondNode.next = firstNode;
		secondNode.previous = firstNode;
	}
}

const getElf = (startingPosition) => {
	return {
		position: startingPosition,
		moves: startingPosition.value+1,
		value: startingPosition.value
	}
}

const getNewValues = (firstElf, secondElf) => {
	const sum = firstElf.value + secondElf.value;
	return sum.toString().split('').map((el) => {
		return Number(el);
	});
}

const addNewValues = (values, active, recipeList) => {
	values.map((v) => {
		active.appendNode(v, recipeList);
		active = active.next;
	})
	return active;
}

const moveElf = (elf) => {
	for(let i = 0; i<elf.moves; i++){
		elf.position = elf.position.next;
	}
	elf.value = elf.position.value;
	elf.moves = elf.value + 1;
}

const readAnswer = (marker) => {
	let answer = '';
	for (let i =0; i<10; i++){
		marker = marker.next;
		answer += marker.value;
	}
	return answer;
}

const runATurn = (values, firstElf, secondElf, active, recipeList) => {
	active = addNewValues(values, active, recipeList);
	moveElf(firstElf);
	moveElf(secondElf);
	return active;
}

const getTenRecipesAfter = (input) => {
	const recipeList = new LinkedList(3, 7);
	let marker = null;
	let active = recipeList.head.next;
	const firstElf = getElf(active.previous);
	const secondElf = getElf(active);
	while(recipeList.length < Number(input)+10){ 
	let values = getNewValues(firstElf, secondElf);
	active = runATurn(values, firstElf, secondElf, active, recipeList);
	 if(!marker){	
		 recipeList.length === Number(input) + 1 ? marker = active.previous : 
		 recipeList.length === Number(input) ? marker = active : null;
	 }
	}
	return readAnswer(marker);
}

const checkPattern = (pattern, inputArray) => {
	pattern = pattern.map((v) => {
		return v.toString();
	})
	inputArray = inputArray.map((v) => {
		return v.toString();
	})
	return JSON.stringify(pattern) === JSON.stringify(inputArray);
}

//returns next node if the pattern is not found, 
//0 if the pattern is found and is either the only digit or the second digit
//1 if the pattern is found and is the first digit of a two-digits number
const lookForPattern = (pattern, input, firstElf, secondElf, active, recipeList) => {
	let values = getNewValues(firstElf, secondElf);
	let index = 0;
	active = runATurn(values, firstElf, secondElf, active, recipeList);
	let found = values.some((v, i) => {
		if (pattern.length === input.length) {
			pattern.shift();
		}
		pattern.push(v);
		if(checkPattern(pattern, input)) {
			values.length === 2 && i === 0 ? index = 1 : null;
			return true;
		}
	})
	if(found) return index;
	return active;
}

const whenPatternAppears = (input) => {
	const recipeList = new LinkedList(3, 7);
	let active = recipeList.head.next;
	const firstElf = getElf(active.previous);
	const secondElf = getElf(active);
	const inputArray = input.split('');
	const pattern = [];
	while(active !== 0 && active !== 1){  //active being 0 or 1 means that the pattern was found
		active = lookForPattern(pattern, inputArray, firstElf, secondElf, active, recipeList);
	}
	//if active was a 1, pattern was found with the tens digit,
	//to ignore the additional digit, active is being subtracted
	return recipeList.length-inputArray.length-active; 
}

const question = (input, num) => {
	if(num === 1){
		return getTenRecipesAfter(input);
	} else {
		return whenPatternAppears(input);
	}
}

module.exports = { 
	getTenRecipesAfter,
	getNewValues,
	whenPatternAppears, 
	checkPattern,
	question
};