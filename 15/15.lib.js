const fs = require('file-system');

const prepareMap = (data) => {
	const mapLength = data.toString().split('\n')[0].length;
	const map = data.toString().split('').map((el, i) => {
		if (el !== '\n' && el !== '#') return {
			x: i%(mapLength+1),
			y: Math.floor(i/(mapLength+1)),
			symbol: el,
			adjacent: []
		};
	}).filter((el) => {
		if (el !== undefined) return el;
	});
	const units = [];
	map.filter((el) => {
		let str = 3;
		if(el.symbol === 'E') {
			str = 23;
		}
		if (el.symbol === 'E' || el.symbol === 'G') 
		units.push( {
			x: el.x,
			y: el.y,
			symbol: el.symbol,
			adjacent: [],
			reachableEnemies: [],
			health: 200,
			attack: str,
			alive: true
		})
	})
	return {
		map: map,
		units: units
	}
}

const comparePosition = (element1, element2) => {
	if (element1.y !== element2.y) return element1.y - element2.y;
	else if (element1.x !== element2.x) return element1.x - element2.x;
	else return 0;
}

const sortUnits = (units) => {
	return units.sort((u1, u2) => comparePosition(u1, u2));
}

const updateUnitsAdjecentFields = (units, map) => {
	return units.map((unit) => {
		unit.adjacent = [];
		map.map((el2) => {
			if(((Math.abs(unit.x - el2.x) === 1 && unit.y - el2.y === 0) ||
				(unit.x - el2.x === 0 && Math.abs(unit.y - el2.y) === 1))){
				unit.adjacent.push(el2);
			}
		})
		return unit;
	})
}

const updateAdjecentFields = (map) => {
	return map.map((el1) => {
		el1.adjacent = [];
		map.map((el2) => {
			if(((Math.abs(el1.x - el2.x) === 1 && el1.y - el2.y === 0) ||
				(el1.x - el2.x === 0 && Math.abs(el1.y - el2.y) === 1))){
				el1.adjacent.push(el2);
			}
		})
		return el1;
	})
}

const isEnemyNearby = (unit) => {
	return unit.adjacent.some((el) => {
		return el.symbol !== '.' && el.symbol !== unit.symbol;
	})
}

const findLowestHealthEnemy = (unit, units) => {
	const enemies = [];
	unit.adjacent.map((field) => {
		units.map((otherUnit) => {
			if(otherUnit.x === field.x && otherUnit.y === field.y
				&& otherUnit.symbol !== unit.symbol){
				enemies.push(otherUnit);
			}
		})
	})
	let enemyToAttack;
	enemies.reduce((health, enemy) => {
		if(enemy.health < health){
			enemyToAttack = enemy;
			return enemy.health;
		} return health;
	}, Infinity)
	return enemyToAttack;
}

const removeHealthPoints = (unitToAttack, units, attacker) => {
	units.some((unit) => {
		if(unitToAttack.x === unit.x && unitToAttack.y === unit.y){
			unitToAttack.health=unitToAttack.health-attacker.attack;
			return true;
		}
	})
	if (unitToAttack.health <= 0) unitToAttack.alive = false;
}

const attack = (unit, units) => {
	const unitToAttack = findLowestHealthEnemy(unit, units);
	removeHealthPoints(unitToAttack, units, unit);
}

const makeGraph = (unitSymbol, map) => {
	const graph = [];
	map.map((el1) => {
		connections = []
		map.map((el2) => {
			const endingValue = (el2.symbol !== '.' && el2.symbol !== el1.symbol);
			if(((Math.abs(el1.x - el2.x) === 1 && el1.y - el2.y === 0) ||
				(el1.x - el2.x === 0 && Math.abs(el1.y - el2.y) === 1)) && 
				el2.symbol !== unitSymbol){
				connections.push({
					ending: endingValue,
					el: el2
				})
			}
		})
		graph.push({
			el: el1,
			connections: connections
		});
	})
	return graph;
}

const findPointInGraph = (point, mapGraph) => {
	let found;
	mapGraph.map((node, i) => {
		if(node.el.x === point.el.x && node.el.y === point.el.y){
			found = i;
		}
	})
	return found;
}

const hasAppeared = (cameFrom, element) => {
	let flag = false;
	cameFrom.map((visited) => {
		if(visited.el.x === element.el.x && visited.el.y === element.el.y){
			flag = true;
		}
	})
	return flag;
}

const BFSfromNearby = (start, mapGraph) => {
	const frontier = [];
	const startingNode = mapGraph[findPointInGraph(start, mapGraph)];
	frontier.push(startingNode);
	const cameFrom = [startingNode];
	let found = false;
	turns = 0;
	let obj = {};
	obj[''+start.el.x+','+start.el.y] = -1;
	while (!found && frontier.length !== 0){
		current = frontier.shift();
		turns++;
		for(let i = 0; i<current.connections.length; i++){
			if(found) break;
			let connection = current.connections[i];
			const newNode = mapGraph[findPointInGraph(connection, mapGraph)];
			if(connection.ending === true) {
				found = ''+connection.el.x+','+connection.el.y;
				i=current.connections.length;
			}
			if(!hasAppeared(cameFrom, connection)){
				frontier.push(newNode);
				cameFrom.push(newNode);
				obj[''+connection.el.x+','+connection.el.y] = '' + current.el.x + ',' + current.el.y;
			}
		}
	}
	if (found === false) return null;
	let starter = {};
	while(obj[obj[found]] !== -1){
		starter.x = Number(obj[found].split(',')[0]);
		starter.y = Number(obj[found].split(',')[1]);
		found = obj[found];
	}
	return getDirection(startingNode, starter);
}

const getDirection = (starting, second) => {
	if(starting.el.x - second.x === -1) {return 'right'}
	if(starting.el.x - second.x === 1) {return 'left'}
	if(starting.el.y - second.y === 1) {return 'up'}
	if(starting.el.y - second.y === -1) {return 'down'}
}

const BFS = (start, mapGraph) => {
	const result = BFSfromNearby(start, mapGraph);
	if(result === null) return null;
	else return result;
}

const findNearestField = (unit, map) => {
	const start = {
		el: {
			x: unit.x,
			y: unit.y},
		symbol: unit.symbol
	}
	const mapGraph = makeGraph(start.symbol, map);
	return BFS(start, mapGraph);
}

const areEnemiesAlive = (unit, units) => {
	let v;
	v =  units.some((otherUnit) => {
		return unit.symbol !== otherUnit.symbol;
	})
	return v;
}

const move = (unit, direction) => {
	if(direction === 'left'){
		unit.x--;
	} else if (direction === 'right'){
		unit.x++;
	} else if (direction === 'up'){
		unit.y--;
	} else if (direction === 'down'){
		unit.y++;
	}	
	return unit;
}

const gravetaking = (units) => {
	return units.filter((unit) => {
		return unit.alive;
	})
}

const getTotalHealth = (units) => {
	return units.reduce((sum, unit) => {
		return unit.health > 0 ? sum + unit.health : sum;
	}, 0)
}

const updateMap = (map, units) => {
	return map.map((el) => {
			let foundUnit = null;
			units.map((unit) => {
				if(unit.x === el.x && unit.y === el.y){
					foundUnit = unit;
				}
			})
			if(foundUnit) return {
				x: el.x,
				y: el.y,
				symbol: foundUnit.symbol
			} 
			return {
				x: el.x,
				y: el.y,
				symbol: '.'
			}
	})
}

const paint = (map) => {
	let k = '';
	for(let i = 0; i<8; i++){
		for (let j = 0; j<7; j++){
			let found = false;
			map.map((el) => {
				if(el.x === j && el.y === i){
					k+=el.symbol;
					found = true;
				}
			})
			if(!found) k+= '#';
		}
		k+='\n';
	}
	console.log(k)
}

const question = (number) => {
	const arr = fs.readFile('./15.txt', (err, data) => {
		let { map, units } = prepareMap(data);
		let end = false;
		let rounds = 0;
		console.log(units);
		while(!end){
			//paint(map)
			sortUnits(units);
			units.map((unit, i) => {
				let attacked = false;
				if(!unit.alive) return;
				if (!areEnemiesAlive(unit, units)){
					end = true;
				}
				if (end === true) return;
				map = updateAdjecentFields(map);
				units = updateUnitsAdjecentFields(units, map);
				if(isEnemyNearby(unit)){
					attack(unit, units);
					attacked = true;
				} else {
					const direction = findNearestField(unit, map);
					if (direction){
						unit = move(unit, direction);
					}
				}
				map = updateAdjecentFields(map);
				units = updateUnitsAdjecentFields(units, map);
				if(!attacked && isEnemyNearby(unit)){
					attack(unit, units);
				}
				units = gravetaking(units);
				map = updateMap(map, units);
			})
			getTotalHealth(units);
			if (end === false) rounds++;
		}
		let noOfElves = 0;
		units.map((u) => {
			console.log(u.symbol);
			if(u.symbol === 'E'){
				noOfElves++;
			}
		})
		console.log(noOfElves);
		const answer = rounds*getTotalHealth(units);
		return console.log(answer);
	})
}

question();

module.exports = {
	getTotalHealth,
	gravetaking, 
	move,
	areEnemiesAlive,
	isEnemyNearby
}