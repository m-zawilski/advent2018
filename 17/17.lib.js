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
	const maxY = ys.reduce((max, y) => {
		if(y>max){
			max = y;
		}
		return max;
	}, 0);
	return {
		minX: minX,
		maxX: maxX,
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
	boxCoords.minY = spring.y;
	return {
		clays: clays,
		boxCoords: boxCoords,
		spring: spring
	}
}

/* End of data reading and preparation */

/* Simulation */

const canGoThere = (element, xChange, yChange, ...blockades) => {
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
		children: [],
		canGoDown: function(clays, stillWater, maxY){
			if(this.y === maxY) return false;
			return canGoThere(this, 0, 1, ...clays, ...stillWater);
		},
		move: function(){
			if (this.direction === 'down'){
				this.y++;
			} else if (this.direction === 'left'){
				this.x--;
			} else if (this.direction === 'right'){
				this.x++;
			}
		},
		moveUp: function(){
			this.y--;
		},
		canGoSide: function(clays, stillWater){
			if (this.direction === 'left'){
			return canGoThere(this, -1, 0, ...clays, ...stillWater);
			} else if (this.direction === 'right'){
			return canGoThere(this, 1, 0, ...clays, ...stillWater);
			}
		}
	}
}

const addToArray = (point, array) => {
	array.some((w) => {
		if(w.x === point.x && w.y === point.y) return true;
	}) ? null : array.push(getPoint(point.x, point.y));
}

const createProbes = (spring, clays, wetSand, stillWater) => {
	const probes = [];
	spring.direction = 'left';
	if(spring.canGoSide(clays, stillWater)) {
		probes.push(getSpring(spring.x, spring.y, 'left'));
	}
	spring.direction = 'right';
	if(spring.canGoSide(clays, stillWater)) {
		probes.push(getSpring(spring.x, spring.y, 'right'));
	}
	return probes;
}

const moveHorizontally = (probes, clays, stillWater, wetSand) => {
	const rainArray = [];
	const waysOut = [];
	probes.map((probe) => {
		let gotOverWall = false;
		while(probe.canGoSide(clays, stillWater) && !gotOverWall){
				console.log(probe);
			rainArray.push(getPoint(probe.x, probe.y));
			probe.move();
			rainArray.push(getPoint(probe.x, probe.y));
			if(!probe.canGoDown(clays, stillWater, Infinity)){
				gotOverWall = true;
			}
		}
		if(gotOverWall){
			probe.move();
			waysOut.push(getPoint(probe.x, probe.y));
		}
	})
	return {
		rainArray: rainArray,
		waysOut: waysOut
	}
}

const runProbes = (spring, clays, wetSand, stillWater, springs) => {
	const probes = [];
	probes.push(...createProbes(spring, clays, wetSand, stillWater));
	if(probes.length > 0) {
		const { rainArray, waysOut } = moveHorizontally(probes, clays, stillWater, wetSand);
		return {
			rainArray: rainArray,
			waysOut: waysOut
		}
	} else {
		return {
			rainArray: [],
			waysOut: []
		}
	}
}

const findWayOut = (spring, clays, wetSand, stillWater, springs) => {
	while(true){
		spring.moveUp();
		const { rainArray, 
						waysOut } = runProbes(spring, clays, wetSand, stillWater, springs);
		if(waysOut.length > 0){
			return { rainArray: rainArray,
								waysOut: waysOut };
		}
	}
}

const spreadHorizontally = (spring, clays, wetSand, stillWater) => {
	const horizontalRain = createProbes(spring, clays, wetSand, stillWater);
	if(horizontalRain.length !== 0){
		horizontalRain.map((hRain) => {
			stillWater.push(getPoint(hRain.x, hRain.y));
			while(hRain.canGoSide(clays, stillWater)){
				hRain.move();
				stillWater.push(getPoint(hRain.x, hRain.y));
				if(hRain.canGoDown(clays, stillWater, Infinity)){
					let newSpring = getSpring(hRain.x, hRain.y, 'down');
					while(newSpring.canGoDown(clays, stillWater)){
						newSpring.move();
					}
					spreadHorizontally(newSpring, clays, wetSand, stillWater);
				}
			}
		})			
	}
}

const fillBowl = (rainArray, clays, wetSand, stillWater ) => {
	const newSprings = rainArray.map((rain) => {
		return newSpring = getSpring(rain.x, rain.y, 'down');
	})
	let bowlFilled = false;
	while(!bowlFilled){
		bowlFilled = true;
		newSprings.map((rain) => {
			wetSand.push(getPoint(rain.x, rain.y));
			const newSpring = getSpring(rain.x, rain.y, 'down');
			if(!newSpring.canGoDown(clays, [], Infinity)) {return;}
			while(newSpring.canGoDown(clays, [], Infinity)){
				newSpring.move();
				stillWater.push(getPoint(newSpring.x, newSpring.y));
				wetSand.some((sand, i) => {
					if(sand.x === newSpring.x && sand.y === newSpring.y){
						wetSand.splice(i,1);
						return true;
					}
				})
			}
			while(newSpring.y !== rain.y){
				spreadHorizontally(newSpring, clays, wetSand, stillWater);
				newSpring.moveUp();
			}
		})
	}
}

const runSimulation = (clays, firstSpring, boxCoords) => {
	const springs = [];
	const stillWater = [];
	const wetSand = [];
	springs.push(getSpring(firstSpring.x, firstSpring.y, 'down'));
	let wasWaterAdded = true;
	let x = 0;
	while(wasWaterAdded){
		wasWaterAdded = false;
		springs.map((spring, i) => {
			console.log(spring);
			while(spring.canGoDown(clays, [], boxCoords.maxY)){
				wasWaterAdded = true;
				spring.move();
				addToArray(spring, wetSand);
			}
			if(canGoThere(spring, 0, 1, clays)){
				const { rainArray, waysOut } = findWayOut(spring, clays, wetSand, stillWater, springs);
				if(rainArray){
					fillBowl(rainArray, clays, wetSand, stillWater);
				}
				waysOut.map((wayOut) => {
					const newSpring = getSpring(wayOut.x, wayOut.y, 'down');
					springs.push(newSpring);
					addToArray(newSpring, wetSand)
				})
			}
			springs.splice(i,1);
		})
		x++;
		if (x===12) {wasWaterAdded = false;}
	}
	return {
		water: stillWater,
		wetSand: wetSand
	}
}

/* End of Simulation */

/* Exports */

const question = (data, number) => {
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
	for(let j = boxCoords.minY; j<=boxCoords.maxY/2; j++){ //division by 10 to make drawing for testing faster
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
			else if(isWater) map+='~';
			else if(isWetSand) map+='|';
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

