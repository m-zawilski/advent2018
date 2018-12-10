// It's no use; your navigation system simply isn't capable of providing walking directions in the arctic circle, and certainly not in 1018.

// The Elves suggest an alternative. In times like these, North Pole rescue operations will arrange points of light in the sky to guide missing Elves back to base. Unfortunately, the message is easy to miss: the points move slowly enough that it takes hours to align them, but have so much momentum that they only stay aligned for a second. If you blink at the wrong time, it might be hours before another message appears.

// You can see these points of light floating in the distance, and record their position in the sky and their velocity, the relative change in position per second (your puzzle input). The coordinates are all given from your perspective; given enough time, those positions and velocities will move the points into a cohesive message!

// Rather than wait, you decide to fast-forward the process and calculate what the points will eventually spell.

// For example, suppose you note the following points:

// position=< 9,  1> velocity=< 0,  2>
// position=< 7,  0> velocity=<-1,  0>
// position=< 3, -2> velocity=<-1,  1>
// position=< 6, 10> velocity=<-2, -1>
// position=< 2, -4> velocity=< 2,  2>
// position=<-6, 10> velocity=< 2, -2>
// position=< 1,  8> velocity=< 1, -1>
// position=< 1,  7> velocity=< 1,  0>
// position=<-3, 11> velocity=< 1, -2>
// position=< 7,  6> velocity=<-1, -1>
// position=<-2,  3> velocity=< 1,  0>
// position=<-4,  3> velocity=< 2,  0>
// position=<10, -3> velocity=<-1,  1>
// position=< 5, 11> velocity=< 1, -2>
// position=< 4,  7> velocity=< 0, -1>
// position=< 8, -2> velocity=< 0,  1>
// position=<15,  0> velocity=<-2,  0>
// position=< 1,  6> velocity=< 1,  0>
// position=< 8,  9> velocity=< 0, -1>
// position=< 3,  3> velocity=<-1,  1>
// position=< 0,  5> velocity=< 0, -1>
// position=<-2,  2> velocity=< 2,  0>
// position=< 5, -2> velocity=< 1,  2>
// position=< 1,  4> velocity=< 2,  1>
// position=<-2,  7> velocity=< 2, -2>
// position=< 3,  6> velocity=<-1, -1>
// position=< 5,  0> velocity=< 1,  0>
// position=<-6,  0> velocity=< 2,  0>
// position=< 5,  9> velocity=< 1, -2>
// position=<14,  7> velocity=<-2,  0>
// position=<-3,  6> velocity=< 2, -1>
// Each line represents one point. Positions are given as <X, Y> pairs: X represents how far left (negative) or right (positive) the point appears, while Y represents how far up (negative) or down (positive) the point appears.

// At 0 seconds, each point has the position given. Each second, each point's velocity is added to its position. So, a point with velocity <1, -2> is moving to the right, but is moving upward twice as quickly. If this point's initial position were <3, 9>, after 3 seconds, its position would become <6, 3>.

// Over time, the points listed above would move like this:

// Initially:
// ........#.............
// ................#.....
// .........#.#..#.......
// ......................
// #..........#.#.......#
// ...............#......
// ....#.................
// ..#.#....#............
// .......#..............
// ......#...............
// ...#...#.#...#........
// ....#..#..#.........#.
// .......#..............
// ...........#..#.......
// #...........#.........
// ...#.......#..........

// After 1 second:
// ......................
// ......................
// ..........#....#......
// ........#.....#.......
// ..#.........#......#..
// ......................
// ......#...............
// ....##.........#......
// ......#.#.............
// .....##.##..#.........
// ........#.#...........
// ........#...#.....#...
// ..#...........#.......
// ....#.....#.#.........
// ......................
// ......................

// After 2 seconds:
// ......................
// ......................
// ......................
// ..............#.......
// ....#..#...####..#....
// ......................
// ........#....#........
// ......#.#.............
// .......#...#..........
// .......#..#..#.#......
// ....#....#.#..........
// .....#...#...##.#.....
// ........#.............
// ......................
// ......................
// ......................

// After 3 seconds:
// ......................
// ......................
// ......................
// ......................
// ......#...#..###......
// ......#...#...#.......
// ......#...#...#.......
// ......#####...#.......
// ......#...#...#.......
// ......#...#...#.......
// ......#...#...#.......
// ......#...#..###......
// ......................
// ......................
// ......................
// ......................

// After 4 seconds:
// ......................
// ......................
// ......................
// ............#.........
// ........##...#.#......
// ......#.....#..#......
// .....#..##.##.#.......
// .......##.#....#......
// ...........#....#.....
// ..............#.......
// ....#......#...#......
// .....#.....##.........
// ...............#......
// ...............#......
// ......................
// ......................
// After 3 seconds, the message appeared briefly: HI. Of course, your message will be much longer and will take many more seconds to appear.

// What message will eventually appear in the sky?

// --- Part Two ---
// Good thing you didn't have to wait, because that would have taken a long time - much longer than the 3 seconds in the example above.

// Impressed by your sub-hour communication capabilities, the Elves are curious: exactly how many seconds would they have needed to wait for that message to appear?

const fs = require('file-system');

const getElement = (xCoordinate, yCoordinate, xVelocity, yVelocity) => {
	return {
		x: xCoordinate,
		y: yCoordinate,
		velocity: {
			x: xVelocity,
			y: yVelocity
		}
	}
}

const runTurns = (pointsOfLight, amount=1) => {
	const array = JSON.parse(JSON.stringify(pointsOfLight));
	return array.map((element) => {
		return getElement(element.x + amount*element.velocity.x, element.y + amount*element.velocity.y,
											element.velocity.x, element.velocity.y);
	});
}

const checkIfAreClose = (pointsOfLight, distance) => {
	const percentage = 90;
	const proximityArray = pointsOfLight.map((pointOfLight, i, array) => {
		return pointsOfLight.some((element, i, arr) => {
			if(arr.indexOf(pointOfLight) === i){
				return false;
			}
			return Math.sqrt(Math.pow(element.x-pointOfLight.x, 2) 
							+ Math.pow(element.y-pointOfLight.y, 2)) < distance;
		});
	});
	const amountOfApproximate = proximityArray.reduce((sum, element) => {
		return element === true ? sum+1 : sum;
	}, 0)
	if(amountOfApproximate/pointsOfLight.length * 100 > percentage){
		return true;
	} else return false;
}

const getMin = (pointsOfLight, coord) => {
	return pointsOfLight.reduce((min, point) => {
		if(point[coord] < min){
			min = point[coord];
		} 
		return min;
	}, Infinity)
}

const wypisz = (pointsOfLight) => {
	let answer = '';
	const coordinates = pointsOfLight.map((point) => {
		return JSON.stringify({
			x: point.x,
			y: point.y
		})
	})
	const yMin = getMin(pointsOfLight, 'y');
	const xMin = getMin(pointsOfLight, 'x');
	for(let i = yMin-5; i<yMin+15; i++) {
		for(let j = xMin-20; j<xMin+80; j++){
			if(coordinates.indexOf(JSON.stringify({x: j, y: i})) !== -1){
				answer += '#';
			} else {
				answer += '.';
			}
		}
		answer+= '\n';
	}
	return answer;
}

const question = () => {
	const arr = fs.readFile('./10.txt', (err, data) => {
		const linesOfData = data.toString().split('\n');
		let pointsOfLight = linesOfData.map((line) => {
			const xCoordinate = Number(line.split('<')[1].split(',')[0]);
			const yCoordinate = Number(line.split('<')[1]
																.split(',')[1].split('>')[0]);
			const xVelocity = Number(line.split('<')[2].split(',')[0])
			const yVelocity = Number(line.split('<')[2].split(',')[1].split('>')[0]);
			return getElement(xCoordinate, yCoordinate, xVelocity, yVelocity);
		});
		let seconds = 0;
		while(!checkIfAreClose(pointsOfLight, 10)){ 
			seconds+=100;
			pointsOfLight = runTurns(pointsOfLight, 100);
		}
		while(!checkIfAreClose(pointsOfLight, 10)){ 
			seconds+=5;
			pointsOfLight = runTurns(pointsOfLight, 5);
		}
		while(!checkIfAreClose(pointsOfLight, 2)){ 
			seconds+=1;
			pointsOfLight = runTurns(pointsOfLight, 1);
		}
		const answer = wypisz(pointsOfLight);
		console.log(`The code is: \n${answer}`);
		console.log(`They had to wait ${seconds} seconds.`);
	})
}

question();