// --- Day 12: Subterranean Sustainability ---
// The year 518 is significantly more underground than your history books implied. Either that, or you've arrived in a vast cavern network under the North Pole.

// After exploring a little, you discover a long tunnel that contains a row of small pots as far as you can see to your left and right. A few of them contain plants - someone is trying to grow things in these geothermally-heated caves.

// The pots are numbered, with 0 in front of you. To the left, the pots are numbered -1, -2, -3, and so on; to the right, 1, 2, 3.... Your puzzle input contains a list of pots from 0 to the right and whether they do (#) or do not (.) currently contain a plant, the initial state. (No other pots currently contain plants.) For example, an initial state of #..##.... indicates that pots 0, 3, and 4 currently contain plants.

// Your puzzle input also contains some notes you find on a nearby table: someone has been trying to figure out how these plants spread to nearby pots. Based on the notes, for each generation of plants, a given pot has or does not have a plant based on whether that pot (and the two pots on either side of it) had a plant in the last generation. These are written as LLCRR => N, where L are pots to the left, C is the current pot being considered, R are the pots to the right, and N is whether the current pot will have a plant in the next generation. For example:

// A note like ..#.. => . means that a pot that contains a plant but with no plants within two pots of it will not have a plant in it during the next generation.
// A note like ##.## => . means that an empty pot with two plants on each side of it will remain empty in the next generation.
// A note like .##.# => # means that a pot has a plant in a given generation if, in the previous generation, there were plants in that pot, the one immediately to the left, and the one two pots to the right, but not in the ones immediately to the right and two to the left.
// It's not clear what these plants are for, but you're sure it's important, so you'd like to make sure the current configuration of plants is sustainable by determining what will happen after 20 generations.

// For example, given the following input:

// initial state: #..#.#..##......###...###

// ...## => #
// ..#.. => #
// .#... => #
// .#.#. => #
// .#.## => #
// .##.. => #
// .#### => #
// #.#.# => #
// #.### => #
// ##.#. => #
// ##.## => #
// ###.. => #
// ###.# => #
// ####. => #
// For brevity, in this example, only the combinations which do produce a plant are listed. (Your input includes all possible combinations.) Then, the next 20 generations will look like this:

//                  1         2         3     
//        0         0         0         0     
//  0: ...#..#.#..##......###...###...........
//  1: ...#...#....#.....#..#..#..#...........
//  2: ...##..##...##....#..#..#..##..........
//  3: ..#.#...#..#.#....#..#..#...#..........
//  4: ...#.#..#...#.#...#..#..##..##.........
//  5: ....#...##...#.#..#..#...#...#.........
//  6: ....##.#.#....#...#..##..##..##........
//  7: ...#..###.#...##..#...#...#...#........
//  8: ...#....##.#.#.#..##..##..##..##.......
//  9: ...##..#..#####....#...#...#...#.......
// 10: ..#.#..#...#.##....##..##..##..##......
// 11: ...#...##...#.#...#.#...#...#...#......
// 12: ...##.#.#....#.#...#.#..##..##..##.....
// 13: ..#..###.#....#.#...#....#...#...#.....
// 14: ..#....##.#....#.#..##...##..##..##....
// 15: ..##..#..#.#....#....#..#.#...#...#....
// 16: .#.#..#...#.#...##...#...#.#..##..##...
// 17: ..#...##...#.#.#.#...##...#....#...#...
// 18: ..##.#.#....#####.#.#.#...##...##..##..
// 19: .#..###.#..#.#.#######.#.#.#..#.#...#..
// 20: .#....##....#####...#######....#.#..##.
// The generation is shown along the left, where 0 is the initial state. The pot numbers are shown along the top, where 0 labels the center pot, negative-numbered pots extend to the left, and positive pots extend toward the right. Remember, the initial state begins at pot 0, which is not the leftmost pot used in this example.

// After one generation, only seven plants remain. The one in pot 0 matched the rule looking for ..#.., the one in pot 4 matched the rule looking for .#.#., pot 9 matched .##.., and so on.

// In this example, after 20 generations, the pots shown as # contain plants, the furthest left of which is pot -2, and the furthest right of which is pot 34. Adding up all the numbers of plant-containing pots after the 20th generation produces 325.

// After 20 generations, what is the sum of the numbers of all pots which contain a plant?

// --- Part Two ---
// You realize that 20 generations aren't enough. After all, these plants will need to last another 1500 years to even reach your timeline, not to mention your future.

// After fifty billion (50000000000) generations, what is the sum of the numbers of all pots which contain a plant?

const fs = require('file-system');

const getNote = (line) => {
	return {
		order: line.split(' => ')[0],
		result: line.split(' => ')[1]
	}
}

const getPot = (content, index) => {
	return {
		content: content,
		index: index
	}
}

const match = (pots, i, notes) => {
	const fivePots = pots[i-2].content + pots[i-1].content + pots[i].content + 
										pots[i+1].content + pots[i+2].content;
	let content;
	notes.map((note) => {
		if (fivePots === note.order){
			content = note.result;
		} 
	})
	return getPot(content, pots[i].index);
}

const trimState = (state) => {
	let isFirst = false;
	let trimmedState = [];
	state.map((pot) => {
		if (isFirst) {
			trimmedState.push(pot);
		}
		else if (pot.content === '#'){
			isFirst = true;
			trimmedState.push(pot);
		}
	})
	for(let i = 1; i<=4; i++){
		trimmedState.unshift(getPot('.', trimmedState[0].index-i));
	}
	let length = trimmedState.length;
	while(trimmedState[length-1].content === '#' 
					|| trimmedState[length-2].content === '#'
					|| trimmedState[length-3].content === '#'
					|| trimmedState[length-4].content === '#'){
		trimmedState.push(getPot('.', trimmedState[length-1].index+1));
	  length++;
	}
	return trimmedState;
}

const getNextGeneration = (state, notes) => {
	state = trimState(state);
	const newState = [];
	for(let i=2; i<state.length-2; i++){
		newState.push(match(state, i, notes));
	}
	return newState;
}

const getResult = (pots, initialLength) => {
	return pots.reduce((sum, pot) => {
		return pot.content === '#' ? sum + pot.index : sum;
	}, 0)
}

const checkPeriod = (state, notes, period) => {
	let checkingState = JSON.parse(JSON.stringify(state));
	for(let i = 0; i<period; i++){
		checkingState = getNextGeneration(checkingState, notes);
	}
	const beforeStable = getResult(checkingState);
	for(let i = 0; i<period; i++){
		checkingState = getNextGeneration(checkingState, notes);
	}
	const firstCheck = getResult(checkingState);
	for(let i = 0; i<period; i++){
		checkingState = getNextGeneration(checkingState, notes);
	}
	const secondCheck = getResult(checkingState);
	if(firstCheck-beforeStable === secondCheck-firstCheck){
		return {
			additionAfterStable: secondCheck-firstCheck,
			valueBeforeStable: beforeStable
		}
	} else return null;
}

const findPattern = (state, notes) => {
	let period = 10;
	let addition = 0;
	let found = false;
	while(!found){
		foundAddition = checkPeriod(state, notes, period);
		if(foundAddition){
			found = true;
		} else {
			period*=10;
		}
	}
	return {
		period: period,
		valueBeforeStable: foundAddition.valueBeforeStable,
		additionAfterStable: foundAddition.additionAfterStable
	}
}

const question = (number) => {
	const arr = fs.readFile('./12.txt', (err, data) => {
		const linesOfData = data.toString().split('\n');
		const initialState = linesOfData[0].split(' ')[2].split('').map((pot, i) => {
			return getPot(pot, i);
		});
		const notes = linesOfData.slice(2).map((line) => {
			return getNote(line);
		})
		let state = initialState;
		if (number === 1){
			for(let i = 0; i<20; i++){
				state = getNextGeneration(state, notes);
			}
			const answer = getResult(state);
			console.log(`The sum of the pots after 20 years is ${answer}.`)
		} else if (number === 2) {
			const pattern = findPattern(state, notes);
			const answer = pattern.valueBeforeStable + 
							(50000000000-pattern.period)/pattern.period*pattern.additionAfterStable;
			console.log(`The sum of the pots after 50000000000 years is ${answer}.`)
		}
	});
}

question(1);
question(2);