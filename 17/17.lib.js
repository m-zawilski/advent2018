const fs = require('file-system');

/* Data reading and preparation */

const getPoint = (x, y) => {
	return {
		x: x,
		y: y
	}
}

const getLineData = (line) => {
	const direction = line.split('=')[1].split(', ')[1];
	const constCoord = Number(line.split('=')[1].split(', ')[0]);
	const start = Number(line.split('=')[2].split('..')[0]);
	const end = Number(line.split('=')[2].split('..')[1]);
	return {
		direction: direction,
		constCoord: constCoord,
		start: start,
		end: end
	}
}

const findCoordinates = (dataLines) => {
	const xs = [];
	const ys = [];
	dataLines.map((line) => {
		const { direction, constCoord, start, end } = getLineData(line);
		if (direction === 'x'){
			ys.push(constCoord);
			xs.push(start, end);
		} else {
			xs.push(constCoord);
			ys.push(start, end);
		}
	})
	const minX = xs.reduce((min, x) => {
		if(x<min){
			min = x;
		}
		return min;
	}, Infinity) - 1;
	const maxX = xs.reduce((max, x) => {
		if(x>max){
			max = x;
		}
		return max;
	}, 0) + 1;
	const minY = ys.reduce((min, y) => {
		if(y<min){
			min = y;
		}
		return min;
	}, Infinity);
	const maxY = ys.reduce((max, y) => {
		if(y>max){
			max = y;
		}
		return max;
	}, 0);
	return {
		minX: minX,
		maxX: maxX,
		minY: minY,
		maxY: maxY
	}
}

const getClays = (dataLines) => {
	const clays = [];
	dataLines.map((line) => {
		const { direction, constCoord, start, end } = getLineData(line);
		if (direction === 'x'){
			for(let i = start; i<=end; i++){
				clays.push(getPoint(i,constCoord));
			}
		} else {
			for(let i = start; i<=end; i++){
				clays.push(getPoint(constCoord, i));
			}
		}
		return clays;
	});
	return clays;
}

const prepareData = (data) => {
	const spring = getPoint(500, 0);
	const dataLines = data.toString().split('\n');
	const clays = getClays(dataLines);
	const boxCoords = findCoordinates(dataLines);
	return {
		clays: clays,
		boxCoords: boxCoords,
		spring: spring
	}
}

/* End of data reading and preparation */

/* Simulation */

const canGoThere = (element, ...blockades) => {
	let xChange = 0, yChange = 0;
	switch(element.direction){
		case 'left':
			xChange--;
			break;
		case 'right':
			xChange++;
			break;
		case 'up':
			yChange--;
			break;
		case 'down':
			yChange++;
			break;
	}

	return !blockades.some((blockade) => {
		if(blockade.x === element.x+xChange && blockade.y === element.y+yChange){
			return true;
		}
	})
}

const getSpring = (x,y,direction) => {
	return {
		x: x,
		y: y,
		direction: direction,
		active: true,
		move: function(){
			if (this.direction === 'down'){
				this.y++;
			} else if (this.direction === 'left'){
				this.x--;
			} else if (this.direction === 'right'){
				this.x++;
			} else if (this.direction === 'up'){
				this.y--;
			}
		}
	}
}

const addToArray = (array, point) => {
	let added = true;
	array.some((w) => {
		if(w.x === point.x && w.y === point.y) return true;
	}) ? (added = false) : array.push(getPoint(point.x, point.y));
	return added;
}

const runProbes = (probes, clays) => {
	probes.map((probe) => {
		let exitFound = false;
		let initialDirection = probe.direction;
		while(canGoThere(probe, ...clays)) probe.move();
		while(!exitFound){
			probe.direction = 'up';
			probe.move();
			probe.direction = initialDirection;
			if(canGoThere(probe, ...clays)){
				exitFound = true;
			} 
		}
		probe.move();
		probe.move();
	})
}

const isBlockInTheMiddle = (probes, clays) => {
	probes[0].direction = 'right';
	let answer = null;
	while(probes[0].x < probes[1].x && canGoThere(probes[0], ...clays)){
		probes[0].move();
		answer = probes[0].x;
		if(probes[0].x === probes[1].x){
			answer = null;
		}
	}
	return answer;
}

const createRainArray = (exits, rainArray, blockInTheMiddle, clays) => {
	if(exits.length === 2){
		const rainLength = exits[1].x - exits[0].x;
		for(let i = 1; i<rainLength; i++){
			rainArray.push(getPoint(exits[0].x+i, exits[0].y));
		}
	} else {
		if(exits[0].direction === 'left'){
			const rainLength = Math.abs(exits[0].x - blockInTheMiddle);
			for(let i = 1; i<rainLength+1; i++){
				rainArray.push(getPoint(exits[0].x+i, exits[0].y));
			}
		} else {
			const probe = getSpring(exits[0].x, exits[0].y, 'left');
			let block = 0;
			while(canGoThere(probe, ...clays)){
				probe.move();
				block = probe.x;
			}
			const rainLength = Math.abs(exits[0].x - block);
			for(let i = rainLength; i>0; i--){
				rainArray.push(getPoint(exits[0].x-i, exits[0].y));
			}
		}
	}
}

const determineExit = (probes, clays, spring) => {
	const rainArray = [], exits = [];
	const initialProbes = JSON.parse(JSON.stringify(probes));
	const blockInTheMiddle = isBlockInTheMiddle(probes, clays);
	if(blockInTheMiddle){
		blockInTheMiddle>spring.x ? exits.push(initialProbes[0]) 
																: exits.push(initialProbes[1]);
	} else {
		if(initialProbes[0].y > initialProbes[1].y){
			exits.push(initialProbes[0])
		} else if (initialProbes[0].y === initialProbes[1].y){
			exits.push(...initialProbes);
		} else {
			exits.push(initialProbes[1]);
		}
	}
	createRainArray(exits, rainArray, blockInTheMiddle, clays);
	return {
		newSprings: exits.map((exit) => {
			return getSpring(exit.x, exit.y, 'down');
		}),
		rainArray: rainArray
	}
}

const findExit = (spring, clays) => {
	const probes = [getSpring(spring.x, spring.y, 'left'), 
									getSpring(spring.x, spring.y, 'right')];
  runProbes(probes, clays);
  return determineExit(probes, clays, spring);
}

const spreadVertically = (point, direction, clays, stillWater) => {
	let rainSpring = getSpring(point.x, point.y, 'down');
	const verticalSprings = [];
	while(canGoThere(rainSpring, ...clays)){
		rainSpring.move();
		verticalSprings.push(getSpring(rainSpring.x, rainSpring.y, direction));
		addToArray(stillWater, getPoint(rainSpring.x, rainSpring.y));
	}
	verticalSprings.map((vs) => {
		while(canGoThere(vs, ...clays)){
			vs.move();	
			addToArray(stillWater, getPoint(vs.x, vs.y));
		}
	})
}

const spreadHorizontally = (rainArray, clays, stillWater) => {
	rainArray.map((rain) => {
		const rainSpring = getSpring(rain.x, rain.y, 'down');
		while(canGoThere(rainSpring, ...clays)){
			rainSpring.move();
			addToArray(stillWater, getPoint(rainSpring.x, rainSpring.y));
		}
	})
}

const fillBowl = (rainArray, clays, stillWater, wetSand) => {
	rainArray.map((rain) => {
		addToArray(wetSand, getPoint(rain.x, rain.y));
	})
	const firstSpring = getSpring(rainArray[0].x, rainArray[0].y, 'down');
	const lastSpring = getSpring(rainArray[rainArray.length-1].x, 
															 rainArray[rainArray.length-1].y, 'down');
	if(!canGoThere(firstSpring, ...clays)){
		rainArray.shift();
	}
	if(!canGoThere(lastSpring, ...clays)){
		rainArray.pop();
	}
	spreadVertically(rainArray[0], 'right', clays, stillWater);
	spreadVertically(rainArray[rainArray.length-1], 'left', clays, stillWater);
	spreadHorizontally(rainArray, clays, stillWater);
}

const clearWetSands = (wetSand, stillWater) => {
	const filteredSand = [];
	wetSand.map((ws) => {
		let found = false;
		stillWater.some((sw) => {
			if(sw.x === ws.x && sw.y === ws.y){
				found = true;
				return found;
			}
		})
		if(!found) filteredSand.push(ws);
	})
	return filteredSand;
}

const runSimulation = (clays, firstSpring, boxCoords) => {
	const springs = [];
	const stillWater = [];
	const wetSand = [];
	springs.push(getSpring(firstSpring.x, firstSpring.y, 'down'));
	let wasWaterAdded = true;

	while(wasWaterAdded) {
		wasWaterAdded = false;
		springs.map((spring) => {
			if(!spring.active) return;
			wasWaterAdded = true;
			while(canGoThere(spring, ...clays)){
				if(spring.y >= boxCoords.minY){
					addToArray(wetSand, getPoint(spring.x, spring.y));
				}
				spring.move();
				if(spring.y === boxCoords.maxY) {
					spring.active = false;
					addToArray(wetSand, getPoint(spring.x, spring.y));
					return;
				}
			} 
			const { newSprings, rainArray } = findExit(spring, clays);

			newSprings.map((ns) => {
				let found = false;
				springs.map((spr) => {
					if(spr.x === ns.x && spr.y === ns.y) found = true;
				})
				if(!found) springs.push(ns);
			})
			spring.active = false;
			fillBowl(rainArray, clays, stillWater, wetSand);
		})
	}

	return {
		water: stillWater,
		wetSand: clearWetSands(wetSand, stillWater)
	}
}

/* End of Simulation */

/* Exports */

const question = (data) => {
	const { clays, boxCoords, spring } = prepareData(data);
	const { water, wetSand } = runSimulation(clays, spring, boxCoords);
	return {
		answer1: water.length + wetSand.length,
		answer2: water.length
	}
}

const drawToFile = (data) => {
	const { clays, boxCoords, spring } = prepareData(data);
	const { water, wetSand } = runSimulation(clays, spring, boxCoords);
	let map = ''; 
	console.log('Drawing started');
	for(let j = 0; j<=boxCoords.maxY; j++){ //division by 10 to make drawing for testing faster
		map+='\n';
		console.log(`Writing line #${j}.`);
		for(let i = boxCoords.minX; i<=boxCoords.maxX; i++){
			if(spring.x === i && spring.y === j) {
				map+='*';
				continue;
			}
			const isClay = clays.some((clay) => {
				if(clay.x === i && clay.y === j){
					return true;
				}
			})
			const isWater = water.some((w) => {
				if(w.x === i && w.y === j){
					return true;
				}
			})
			const isWetSand = wetSand.some((ws) => {
				if(ws.x === i && ws.y === j){
					return true;
				}
			})
			if(isClay) map+='#';
			else if(isWetSand) map+='|';
			else if(isWater) map+='~';
			else map+='.';
		}
	}
	fs.writeFile('17map.txt', map);
	console.log('Drawing ended');
}

module.exports = {
	question,
	drawToFile
}

