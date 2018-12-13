// --- Day 13: Mine Cart Madness ---
// A crop of this size requires significant logistics to transport produce, soil, fertilizer, and so on. The Elves are very busy pushing things around in carts on some kind of rudimentary system of tracks they've come up with.

// Seeing as how cart-and-track systems don't appear in recorded history for another 1000 years, the Elves seem to be making this up as they go along. They haven't even figured out how to avoid collisions yet.

// You map out the tracks (your puzzle input) and see where you can help.

// Tracks consist of straight paths (| and -), curves (/ and \), and intersections (+). Curves connect exactly two perpendicular pieces of track; for example, this is a closed loop:

// /----\
// |    |
// |    |
// \----/
// Intersections occur when two perpendicular paths cross. At an intersection, a cart is capable of turning left, turning right, or continuing straight. Here are two loops connected by two intersections:

// /-----\
// |     |
// |  /--+--\
// |  |  |  |
// \--+--/  |
//    |     |
//    \-----/
// Several carts are also on the tracks. Carts always face either up (^), down (v), left (<), or right (>). (On your initial map, the track under each cart is a straight path matching the direction the cart is facing.)

// Each time a cart has the option to turn (by arriving at any intersection), it turns left the first time, goes straight the second time, turns right the third time, and then repeats those directions starting again with left the fourth time, straight the fifth time, and so on. This process is independent of the particular intersection at which the cart has arrived - that is, the cart has no per-intersection memory.

// Carts all move at the same speed; they take turns moving a single step at a time. They do this based on their current location: carts on the top row move first (acting from left to right), then carts on the second row move (again from left to right), then carts on the third row, and so on. Once each cart has moved one step, the process repeats; each of these loops is called a tick.

// For example, suppose there are two carts on a straight track:

// |  |  |  |  |
// v  |  |  |  |
// |  v  v  |  |
// |  |  |  v  X
// |  |  ^  ^  |
// ^  ^  |  |  |
// |  |  |  |  |
// First, the top cart moves. It is facing down (v), so it moves down one square. Second, the bottom cart moves. It is facing up (^), so it moves up one square. Because all carts have moved, the first tick ends. Then, the process repeats, starting with the first cart. The first cart moves down, then the second cart moves up - right into the first cart, colliding with it! (The location of the crash is marked with an X.) This ends the second and last tick.

// Here is a longer example:

// /->-\        
// |   |  /----\
// | /-+--+-\  |
// | | |  | v  |
// \-+-/  \-+--/
//   \------/   

// /-->\        
// |   |  /----\
// | /-+--+-\  |
// | | |  | |  |
// \-+-/  \->--/
//   \------/   

// /---v        
// |   |  /----\
// | /-+--+-\  |
// | | |  | |  |
// \-+-/  \-+>-/
//   \------/   

// /---\        
// |   v  /----\
// | /-+--+-\  |
// | | |  | |  |
// \-+-/  \-+->/
//   \------/   

// /---\        
// |   |  /----\
// | /->--+-\  |
// | | |  | |  |
// \-+-/  \-+--^
//   \------/   

// /---\        
// |   |  /----\
// | /-+>-+-\  |
// | | |  | |  ^
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /----\
// | /-+->+-\  ^
// | | |  | |  |
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /----<
// | /-+-->-\  |
// | | |  | |  |
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /---<\
// | /-+--+>\  |
// | | |  | |  |
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /--<-\
// | /-+--+-v  |
// | | |  | |  |
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /-<--\
// | /-+--+-\  |
// | | |  | v  |
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /<---\
// | /-+--+-\  |
// | | |  | |  |
// \-+-/  \-<--/
//   \------/   

// /---\        
// |   |  v----\
// | /-+--+-\  |
// | | |  | |  |
// \-+-/  \<+--/
//   \------/   

// /---\        
// |   |  /----\
// | /-+--v-\  |
// | | |  | |  |
// \-+-/  ^-+--/
//   \------/   

// /---\        
// |   |  /----\
// | /-+--+-\  |
// | | |  X |  |
// \-+-/  \-+--/
//   \------/   
// After following their respective paths for a while, the carts eventually crash. To help prevent crashes, you'd like to know the location of the first crash. Locations are given in X,Y coordinates, where the furthest left column is X=0 and the furthest top row is Y=0:

//            111
//  0123456789012
// 0/---\        
// 1|   |  /----\
// 2| /-+--+-\  |
// 3| | |  X |  |
// 4\-+-/  \-+--/
// 5  \------/   
// In this example, the location of the first crash is 7,3.

// --- Part Two ---
// There isn't much you can do to prevent crashes in this ridiculous system. However, by predicting the crashes, the Elves know where to be in advance and instantly remove the two crashing carts the moment any crash occurs.

// They can proceed like this for a while, but eventually, they're going to run out of carts. It could be useful to figure out where the last cart that hasn't crashed will end up.

// For example:

// />-<\  
// |   |  
// | /<+-\
// | | | v
// \>+</ |
//   |   ^
//   \<->/

// /---\  
// |   |  
// | v-+-\
// | | | |
// \-+-/ |
//   |   |
//   ^---^

// /---\  
// |   |  
// | /-+-\
// | v | |
// \-+-/ |
//   ^   ^
//   \---/

// /---\  
// |   |  
// | /-+-\
// | | | |
// \-+-/ ^
//   |   |
//   \---/
// After four very expensive crashes, a tick ends with only one cart remaining; its final location is 6,4.

// What is the location of the last cart at the end of the first tick where it is the only cart left?

const fs = require('file-system');

const handleCrossing = (cart) => {
	const { nextTurn, direction } = cart;
	if (nextTurn === 'left'){
		cart.nextTurn='straight';
		switch (direction){
			case 'down':
				cart.direction = 'right';
				break;
			case 'up':
				cart.direction = 'left';
				break;
			case 'left':
				cart.direction = 'down';
				break;
			case 'right': 
				cart.direction = 'up';
				break;
		}
	} else if (nextTurn === 'right'){
		cart.nextTurn='left';
		switch (direction){
			case 'down':
				cart.direction = 'left';
				break;
			case 'up':
				cart.direction = 'right';
				break;
			case 'left':
				cart.direction = 'up';
				break;
			case 'right': 
				cart.direction = 'down';
				break;
		}
	} else cart.nextTurn='right';
}

const getCart = (x, y, symbol) => {
	let direction;
	if (symbol === 'v') direction = 'down';
	else if (symbol === '^') direction = 'up';
	else if (symbol === '>') direction = 'right';
	else if (symbol === '<') direction = 'left';
	return {
		startingPosition: {
			x: x,
			y: y
		},
		x: x,
		y: y,
		direction: direction,
		nextTurn: 'left',
		crashed: false,
		move: function() {
			const { direction } = this;
			if(direction === 'down'){
				this.y++;
			} else if (direction === 'up'){
				this.y--;
			} else if (direction === 'right'){
				this.x++;
			} else if (direction === 'left'){
				this.x--;
			}
		},
		changeDirection: function(symbol) {
			if(symbol === '+'){
				handleCrossing(this);
			} else if (symbol === '/'){
				if (this.direction === 'down') this.direction = 'left';
				else if (this.direction === 'up') this.direction = 'right';
				else if (this.direction === 'right') this.direction = 'up';
				else if (this.direction === 'left') this.direction = 'down';
			} else {
				if (this.direction === 'down') this.direction = 'right';
				else if (this.direction === 'up') this.direction = 'left';
				else if (this.direction === 'right') this.direction = 'down';
				else if (this.direction === 'left') this.direction = 'up';
			}
		}
	}
}

const getRoadChange = (x, y, symbol) => {
	return {
		x: x,
		y: y,
		symbol: symbol
	}
}

const sortCarts = (carts) => {
	carts.sort((cart1, cart2) => comparePosition(cart1, cart2));
}

const comparePosition = (element1, element2) => {
	if (element1.y !== element2.y) return element1.y - element2.y;
	else if (element1.x !== element2.x) return element1.x - element2.x;
	else return 0;
}

const runCarts = (carts, roadChanges) => {
	let crashPlaces = [];
	carts.map((cart) => {
		if(!cart.crashed) {
			cart.move();
		}
		carts.map((secondCart) => {
			if(carts.indexOf(secondCart) === carts.indexOf(cart)) return;
			else if (comparePosition(cart, secondCart) === 0) {
				cart.crashed = true;
				secondCart.crashed = true;
				crashPlaces.push({
					x: cart.x,
					y: cart.y,
					carts: [cart, secondCart]
				})
			}
		})
	})
	carts.map((cart) => {
		roadChanges.some((roadChange) => {
			if(comparePosition(cart, roadChange) === 0){
				cart.changeDirection(roadChange.symbol);
				return true;
			} else return false;
		})
	})
	if(crashPlaces.length === 0) return null;
	return crashPlaces;
}

removeCrashedCarts = (carts, i) => {
	const newCarts = [];
	carts.map((cart) => {
		if(!cart.crashed) newCarts.push(cart);
	})
	return newCarts;
}

const question = (number) => {
	const arr = fs.readFile('./13.txt', (err, data) => {
		const linesOfData = data.toString().split('\n');
		const roadSymbols = ['+', '/', '\\']
		const cartSymbols = ['v', '^', '>', '<']
		const roadChanges = [];
		let crashPlace = null;
		let carts = [];
		linesOfData.map((line, y) => {
			line.split('').map((element, x) => {
				if(roadSymbols.includes(element)){
					roadChanges.push(getRoadChange(x, y, element));
				} else if (cartSymbols.includes(element)){
					carts.push(getCart(x, y,element));
				}
			})
		})
		if(number===1){
			while(!crashPlace) {
				sortCarts(carts);
				crashPlace = runCarts(carts, roadChanges);
			}
			crashPlace = crashPlace[0];
			console.log(`The first crash happens at ${crashPlace.x},${crashPlace.y}.`);
		}
		if(number===2){
			let i=0;
			while(carts.length !== 1){
				i++;
				sortCarts(carts);
				runCarts(carts, roadChanges);
				carts = removeCrashedCarts(carts, i);
			}
			console.log(`The last remaining cart is at ${carts[0].x},${carts[0].y}.`)
		}
	})
}

question(1);
question(2);