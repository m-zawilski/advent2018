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
				if(!hasTwo && element.number === 2){
					noOfTwos++;
					hasTwo = true;
				} else if (!hasThree && element.number === 3){
					noOfThrees++;
					hasThree = true;
				}
			})
			arr = [];
		});
		console.log('Final number: ', noOfTwos * noOfThrees);
	})
}

question();

// What are the common characters of two almost identical boxes?

const question2 = () => {
	fs.readFile('./2.txt', (err, data) => {
		const boxes = data.toString().split('\n');
		let answer = '', position = -1;
		for (let i = 0; i<boxes.length; i++){					//first box to compare
			for (let j = i+1; j<boxes.length; j++){			//second box to compare
				for (let k = 0; k<boxes[0].length; k++){	//compare letter by letter
					if (boxes[i][k] !== boxes[j][k]){
						if (position === -1){
							position = k;
						} else {
							position = -1;
							break;
						}
					}
				}
				if (position !== -1){
					answer = boxes[i].substr(0, position) + 
						boxes[i].substr(position+1, boxes[i].length-1);
				}
			}
		}
		console.log('Common characters: ', answer);
	})
}

question2();


