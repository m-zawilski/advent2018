const fs = require('file-system');

const getElement = (x, y, type) => {
	return {
		x: x,
		y: y, 
		type: type
	}
}

const getScore = (map) => {
	let treesCounter = 0, lumberyardsCounter = 0;
	map.map((field) => {
		if(field.type==='#') lumberyardsCounter++;
		if(field.type==='|') treesCounter++;
	})
	return treesCounter*lumberyardsCounter;
}

const createMap = (data) => {
	const mapData = data.toString().split('\n').map((line) => {
		return line.split('');
	})
	const newMap = [];
	mapData.map((rows, y) => {
		rows.map((cell, x) => {
			newMap.push(getElement(x, y, cell));
		})
	})
	return newMap;
}

const getNeighbours = (field, map) => {
	const neighbours = [];
	map.map((otherField) => {
		const distance = Math.sqrt(Math.pow(otherField.x-field.x,2)
										+Math.pow(otherField.y-field.y,2))
		if(distance<2 && distance>0){
			neighbours.push(otherField);
		}
	})
	return neighbours;
}

const checkATree = (field, neighbours) => {
	let count = 0;
	neighbours.map((nbr) => {
		if(nbr.type === '#'){count++;}
	})
	if(count>=3){field.type='#';}
}

const checkALumbyard = (field, neighbours) => {
	let isTree = false, isLumbyard = false;
	neighbours.map((nbr) => {
		if(nbr.type === '|'){isTree = true};
		if(nbr.type === '#'){isLumbyard = true};
	})
	if(!isTree || !isLumbyard){field.type='.';}
}

const checkOpen = (field, neighbours) => {
	let count = 0;
	neighbours.map((nbr) => {
		if(nbr.type === '|'){count++;}
	})
	if(count>=3){field.type='|';}
}

const runATurn = (map) => {
	const mapCopy = JSON.parse(JSON.stringify(map));
	return mapCopy.map((field) => {
		const neighbours = getNeighbours(field, map);
		if(field.type === '|'){
			checkATree(field, neighbours);
		} else if (field.type === '#'){
			checkALumbyard(field, neighbours);
		} else {
			checkOpen(field, neighbours);
		}
		return field;
	})
}

const question = (number) => {
	fs.readFile('./18.txt', (err, data) => {
		let map = createMap(data);
		if(number === 1){
			for(let i = 0; i<10; i++){
				map = runATurn(map);
			}
			console.log(`The score after 10 turns is ${getScore(map)}.`);
		}
		if(number === 2){
			let patternFound = false;
			const mapResults = [];
			mapResults.push(getScore(map));
			let patternStart, patternPeriod;
			while(!patternFound){
				map = runATurn(map);
				const result = getScore(map);
				if(mapResults.indexOf(result) !== -1){
					const firstResultIndex = mapResults.indexOf(result);
					const secondResultIndex = mapResults.length;
					mapResults.push(result);
					map = runATurn(map);
					nextResult = getScore(map);
					if(mapResults.indexOf(nextResult) === firstResultIndex+1){
						patternFound = true;
						patternStart = firstResultIndex;
						patternPeriod = secondResultIndex - firstResultIndex;
					}
					else {
						mapResults.push(nextResult);
					}
				} else {
					mapResults.push(result);
				}
			}
			const whichInPeriod = (1000000000-patternStart)%patternPeriod;
			console.log(`The result after 1000000000 turns is ${mapResults[whichInPeriod+patternStart]}`);
		}
	})
}

question(1);
question(2);



