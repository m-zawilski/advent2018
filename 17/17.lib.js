const fs = require('file-system');

const getPoint = (x, y, type) => {
	return {
		x: x,
		y: y,
		type: type
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
				clays.push(getPoint(i,constCoord,'clay'));
			}
		} else {
			for(let i = start; i<=end; i++){
				clays.push(getPoint(constCoord, i,'clay'));
			}
		}
		return clays;
	});
	return clays;
}

const getMap = (boxCoords, clays, spring) => {
	const map = [];
	for(let i = boxCoords.minY; i <= boxCoords.maxY; i++){
		for(let j = boxCoords.minX; j <= boxCoords.maxX; j++){
			if(spring.x === j && spring.y === i) {
				map.push(spring);
				continue;
			}
			const isClay = clays.some((clay) => {
				if(clay.x === j && clay.y === i){
					map.push(clay);
					return true;
				}
				return false;
			})
			if (!isClay) {
				map.push(getPoint(j,i,'sand'));
			}
		}
	}
	return map;
}

const prepareData = (data) => {
	const spring = getPoint(500, 0, 'spring');
	const dataLines = data.toString().split('\n');
	const clays = getClays(dataLines);
	const boxCoords = findCoordinates(dataLines);
	boxCoords.minY = spring.y;
	const map = getMap(boxCoords, clays, spring);
	return {
		map: map,
		boxCoords: boxCoords,
		spring: spring
	}
}

const canGoDown = (x,y,map) => {
	return map.some((el) => {
		//console.log(x,y, el.x, el.y)
		if(el.x === x && el.y === y+1 && el.type === 'sand'){
			return true;
		}
	})
}

const getSpring = (x,y,direction,map) => {
	return {
		x: x,
		y: y,
		direction: direction,
		canGoDown: canGoDown(x,y,map)
	}
}

const question = (data, number) => {
	const { map, boxCoords, spring } = prepareData(data);
	drawToFile(map, boxCoords.maxX - boxCoords.minX);
	const springs = [];
	springs.push(getSpring(spring.x, spring.y, 'down', map));
	console.log(springs);

}

const drawToFile = (map, lineLength) => {
	let wr = ''; 
	map.map((el, i) => {
		if(i%(lineLength+1) === 0) wr+='\n';
		if(el.type === 'clay') wr+='#'; 
		else if(el.type === 'sand') wr+='.';
		else if(el.type === 'spring') wr+='*';
		else if(el.type === 'water') wr+='~';
		else wr+='$';
	});
	fs.writeFile('17map.txt', wr);
}

module.exports = {
	question
}


