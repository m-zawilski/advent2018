const getField = (x,y) => {
	return {
		x: x,
		y: y,
		GI: null,
		EL: null,
		type: null
	}
}

const initializeFields = (target) => {
	const fields = [];
	for(let y = 0; y<=target.y+25; y++){
		for(let x = 0; x<=target.x+25; x++){
			fields.push(getField(x,y));
		}
	}
	return fields;
}

const getErosionLevel = (x,y,fields) => {
	let EL;
	fields.some((f) => {
		if(f.x === x && f.y === y) {
			EL = f.EL;
			return true;
		}
	})
	return EL;
}

const findFieldGeologicalIndex = (field, fields, target) => {
	if(field.x === 0 && field.y === 0) field.GI = 0;
	else if(field.x === target.x && field.y === target.y) field.GI = 0;
	else if(field.y === 0) field.GI = field.x*16807;
	else if(field.x === 0) field.GI = field.y*48271;
	else field.GI = getErosionLevel(field.x-1,field.y, fields) * 
									getErosionLevel(field.x,field.y-1, fields);
	return field;
}

const findFieldErosionLevel = (field, depth) => {
	field.EL = (field.GI+depth) % 20183;
	return field;
}

const getAllErosionLevels = (fields, depth, target) => {
	return fields.map((field) => {
		field = findFieldGeologicalIndex(field, fields, target);
		field = findFieldErosionLevel(field, depth);
		return field;
	})
}

const getType = (field) => {
	let value = field.EL % 3;
	switch (value) {
		case 0:
			field.type = {
				name: 'rocky',
				value: value
			}
			break;
		case 1:
			field.type = {
				name: 'wet',
				value: value
			}
			break;
		case 2:
			field.type = {
				name: 'narrow',
				value: value
			}
			break;
	}
	return field;
}

const getAllTypes = (fields) => {
	return fields.map((field) => {
		field = getType(field);
		return field;
	})
}

const getRiskLevel = (fields) => {
	return fields.reduce((riskLevel, field) => {
		return riskLevel + field.type.value;
	}, 0)
}

const checkDistance = (field, otherField) => {
	return Math.abs(field.x-otherField.x)+Math.abs(field.y-otherField.y);
}

const getGraphNode = (field, tool) => {
	return {
		x: field.x,
		y: field.y,
		level: tool,
		neighbours: []
	}
}

const initializeGraphs = (fields) => {
	const torchGraph = [], climbingGearGraph = [], neitherGraph = [];
	fields.map((field) => {
		switch (field.type.name){
			case 'rocky':
				climbingGearGraph.push(getGraphNode(field, 'climbing gear'));
				torchGraph.push(getGraphNode(field, 'torch'));
				break;
			case 'wet':
				climbingGearGraph.push(getGraphNode(field, 'climbing gear'));
				neitherGraph.push(getGraphNode(field, 'neither'));
				break;
			case 'narrow':
				torchGraph.push(getGraphNode(field, 'torch'));
				neitherGraph.push(getGraphNode(field, 'neither'));
				break;
		}
	});
	return {
		torchGraph: torchGraph,
		climbingGearGraph: climbingGearGraph,
		neitherGraph: neitherGraph	
	}
}

const connectItemGraphNodes = (graph) => {
	graph.map((el) => {
		graph.map((el2) => {
			if(checkDistance(el, el2) === 1) el.neighbours.push({
				goTo: el2,
				time: 1
			});
		})
	})
}

const createItemGraphs = (fields) => {
	const { torchGraph, climbingGearGraph, neitherGraph } = initializeGraphs(fields);
	connectItemGraphNodes(torchGraph);
	connectItemGraphNodes(climbingGearGraph);
	connectItemGraphNodes(neitherGraph);
	return {
		torchGraph: torchGraph,
		climbingGearGraph: climbingGearGraph,
		neitherGraph: neitherGraph
	}
}

const connectGraphs = (torchGraph, climbingGearGraph, neitherGraph) => {
	const graph = [];
	torchGraph.map((torchEl) => {
		climbingGearGraph.map((climbEl) => {
			if(checkDistance(torchEl, climbEl) === 0) {
				torchEl.neighbours.push({
					goTo: climbEl,
					time: 7
				});
			}
		})
		neitherGraph.map((neitherEl) => {
			if(checkDistance(torchEl, neitherEl) === 0) {
				torchEl.neighbours.push({
					goTo: neitherEl,
					time: 7
				});
			}
		})
		graph.push(torchEl);
	})
	neitherGraph.map((neitherEl) => {
		climbingGearGraph.map((climbEl) => {
			if(checkDistance(neitherEl, climbEl) === 0) {
				neitherEl.neighbours.push({
					goTo: climbEl,
					time: 7
				});
			}
		})
		torchGraph.map((torchEl) => {
			if(checkDistance(torchEl, neitherEl) === 0) {
				neitherEl.neighbours.push({
					goTo: torchEl,
					time: 7
				});
			}
		})
		graph.push(neitherEl);
	})
	climbingGearGraph.map((climbEl) => {
		neitherGraph.map((neitherEl) => {
			if(checkDistance(neitherEl, climbEl) === 0) {
				climbEl.neighbours.push({
					goTo: neitherEl,
					time: 7
				});
			}
		})
		torchGraph.map((torchEl) => {
			if(checkDistance(torchEl, climbEl) === 0) {
				climbEl.neighbours.push({
					goTo: torchEl,
					time: 7
				});
			}
		})
		graph.push(climbEl);
	})
	return graph;
}

const createGraph = (fields) => {
	const { torchGraph, climbingGearGraph, neitherGraph } = createItemGraphs(fields);
	return connectGraphs(torchGraph, climbingGearGraph, neitherGraph);
}

const heuristic = (target, field) => {
	return Math.abs(target.x-field.x)+Math.abs(target.y-field.y);
}

const runAStar = (graph, target) => {
	const frontier = [];
	frontier.push({
		element: graph[0], 
		cost: 0
	});
	const cameFrom = {};
	const costSoFar = {};
	cameFrom[`${graph[0].x},${graph[0].y},torch`] = null;
	costSoFar[`${graph[0].x},${graph[0].y},torch`] = 0;
	let current;
	while(frontier.length !== 0){
		frontier.sort((f1, f2) => {
			return f1.cost-f2.cost;
		})
		current = frontier.shift();
		let element = current.element;
		if(element.x === target.x && 
			element.y === target.y && 
			element.level === 'torch') break;

		element.neighbours.map((neigh) => {
			let goTo = neigh.goTo;
			let newCost = 
					costSoFar[`${element.x},${element.y},${element.level}`] + neigh.time;
			if (Object.keys(costSoFar)
					.indexOf(`${goTo.x},${goTo.y},${goTo.level}`) === -1 
					|| newCost < costSoFar[`${goTo.x},${goTo.y},${goTo.level}`]){
				costSoFar[`${goTo.x},${goTo.y},${goTo.level}`] = newCost;
				frontier.push({
					element: goTo,
					cost: newCost + heuristic(target, goTo),
					time: newCost
				});
				cameFrom[`${goTo.x},${goTo.y},${goTo.level}`] = current;
			}
		})
	}
	return current.time;
}

const getMinutes = (fields, target) => {
	const graph = createGraph(fields);
	return answer = runAStar(graph, target);
}

const question = (depth, target) => {
	let fields = initializeFields(target);
	fields = getAllErosionLevels(fields, depth, target);
	fields = getAllTypes(fields);
	return {
		answer1: getRiskLevel(fields),
		answer2: getMinutes(fields, target)
	};
}

module.exports = {
	question
}