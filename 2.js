// read line
// iterate while adding letters to four arrays - ones, twos and threes and more
const fs = require('file-system');

// What is the checksum of boxes?

class Letter {
	constructor(currentLetter) {
		this.char = currentLetter,
		this.number = 1
	}
}

const checkArray = (arr, value) => {
	let check = false;
	arr.forEach((element) => {
		if (element.char === value){
			check = true;
			element.number++;
		}
	})
	return check;
}

const question = () => {
	fs.readFile('./2.txt', (err, data) => {
		const boxes = data.toString().split('\n');
		let noOfTwos = 0, noOfThrees = 0, arr = [];
		boxes.map((currentBox) => {
			let lettersOfBox = currentBox.split('');
			lettersOfBox.some((currentLetter) => {
				if (!checkArray(arr, currentLetter)) {
					const newLetter = new Letter(currentLetter);
					arr.push(newLetter);
				}
			});
			let hasTwo = false, hasThree = false;
			arr.map((element) => {
				if(element.number === 2 && !hasTwo){
					noOfTwos++;
					hasTwo = true;
				} else if (element.number === 3 && !hasThree){
					noOfThrees++;
					hasThree = false;
				}
			})
			arr = [];
		});
		const answer = noOfTwos * noOfThrees;
		console.log('Final number: ', answer);
	})
}

question();

// What are the common characters of two boxes with fabrics?

const question2 = () => {
	fs.readFile('./2.txt', (err, data) => {
		const boxes = data.toString().split('\n');
		let answer = '';
		let position = -1;
		let twoLetters = false;
		for (let i = 0; i<boxes.length; i++){
			for (let j = i+1; j<boxes.length; j++){
				for (let k = 0; k<boxes[0].length; k++){
					if (boxes[i][k] !== boxes[j][k]){
						if (position === -1){
							position = k;
						} else {
							position = -1;
							twoLettres = true;
							break;
						}
					}
				}
				if (twoLetters || position === -1){
					position = -1;
					twoLetters=false;
				} else {
					answer = boxes[i].substr(0, position) + boxes[i].substr(position+1, boxes[i].length-1);
				}
			}
		}
		console.log('Common characters: ', answer);
	})
}

question2();


