const fs = require('file-system');

const readData = (data) => {
	return rowsOfData = data.toString().split('\n').sort();
}

const createGuard = (guardNumber, timestampsArray) => {
	return {
		number: guardNumber,
		minutesArray: timestampsArray
	}
}

const prepareData = (data) => {
	const rowsOfData = readData(data);
	let currentGuard = null;
	let timestamps = [];
	let guardsData = [];
	rowsOfData.map((row, i) => {
		const timestamp = row.split('] ')[0].substr(1,);
		const minutes = timestamp
			.substr(timestamp.length-2,timestamp.length-1);
		const message = row.split('] ')[1];
		if (message[0] === 'G'){
			if (currentGuard !== null){
				let guardInArray = false;
				let guardPosition = -1;
				guardsData.map((guard, i) => {
					if (guard.number === currentGuard){
						guardInArray = true;
						guardPosition = i;
					}
				})
				if (guardInArray){
					let guardToUpdate = guardsData[guardPosition];
					guardToUpdate.minutesArray.push(...timestamps);
					guardsData[guardPosition] = guardToUpdate;
				} else {
					let guard = createGuard(currentGuard, timestamps);
					guardsData.push(guard);
				}
			}
			currentGuard = message.split('#')[1].split(' ')[0];
			timestamps = [];
		} else {
			timestamps.push(minutes);
		}
		if (i === rowsOfData.length-1){
			let guard = createGuard(currentGuard, timestamps);
			guardsData.push(guard);
		}
	});
	return guardsData;
}

const findBiggestSleeper = (data) => {
	let number;
	let minutes = 0;
	let array;
	data.map((guard) => {
		if(guard.minutesArray.length === 0) return;
		let totalSleepingTime = guard.minutesArray.reduce((acc, element, i) => {
			let minute = Number(element);
			if (i%2) {
				return acc+minute;
			} else {
				return acc-minute;
			}
		}, 0)
		if(totalSleepingTime > minutes){
			minutes = totalSleepingTime;
			number = guard.number;
			array = guard.minutesArray;
		}
	})
	return {
		number: number,
		minutes: minutes,
		minutesArray: array
	}
}

const findTheMinute = (minutes) => {
	let theMinute = 0;
	let maxOccurances = 0;
	let counter = 0;
	for(let i = 0; i<60; i++){
		counter = 0;
		for(let j = 0; j < minutes.length; j+=2){
			if(i>=minutes[j] && i<minutes[j+1]) counter++;
		}
		if (counter > maxOccurances){
			maxOccurances = counter;
			theMinute = i;
		}
	}
	return {
		theMinute: theMinute,
		occurances: maxOccurances
	};
}

//Which guard sleeps the most and on which minute specifically? 

const question1 = () => {
	const arr = fs.readFile('./4.txt', (err, data) => {
		const dataPrepared = prepareData(data);
		const biggestSleeper = findBiggestSleeper(dataPrepared);
		const theMinute = findTheMinute(biggestSleeper.minutesArray).theMinute;
		console.log(`First strategy: Guard number ${biggestSleeper.number}` +
			` at minute ${theMinute}, the answer is ${biggestSleeper.number*theMinute}`)
	});
}

question1();

//Which guard sleeps on a specific minute? 

const question2 = () => {
	const arr = fs.readFile('./4.txt', (err, data) => {
		const dataPrepared = prepareData(data);
		let theMinuteData;
		let maxOccurances = 0;
		let guardNumber, minute;
		dataPrepared.map((guard) => {
			theMinuteData = findTheMinute(guard.minutesArray);
			if (theMinuteData.occurances > maxOccurances){
				minute = theMinuteData.theMinute;
				guardNumber = guard.number;
				maxOccurances = theMinuteData.occurances;
			}
		})
		console.log(`Second strategy: Guard number ${guardNumber}` + 
			` at minute ${minute}, the answer is ${guardNumber*minute}`);
	})
}

question2();