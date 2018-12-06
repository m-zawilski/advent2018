// --- Day 3: No Matter How You Slice It ---
// The Elves managed to locate the chimney-squeeze prototype fabric for Santa's suit (thanks to someone who helpfully wrote its box IDs on the wall of the warehouse in the middle of the night). Unfortunately, anomalies are still affecting them - nobody can even agree on how to cut the fabric.

// The whole piece of fabric they're working on is a very large square - at least 1000 inches on each side.

// Each Elf has made a claim about which area of fabric would be ideal for Santa's suit. All claims have an ID and consist of a single rectangle with edges parallel to the edges of the fabric. Each claim's rectangle is defined as follows:

// The number of inches between the left edge of the fabric and the left edge of the rectangle.
// The number of inches between the top edge of the fabric and the top edge of the rectangle.
// The width of the rectangle in inches.
// The height of the rectangle in inches.
// A claim like #123 @ 3,2: 5x4 means that claim ID 123 specifies a rectangle 3 inches from the left edge, 2 inches from the top edge, 5 inches wide, and 4 inches tall. Visually, it claims the square inches of fabric represented by # (and ignores the square inches of fabric represented by .) in the diagram below:

// ...........
// ...........
// ...#####...
// ...#####...
// ...#####...
// ...#####...
// ...........
// ...........
// ...........
// The problem is that many of the claims overlap, causing two or more claims to cover part of the same areas. For example, consider the following claims:

// #1 @ 1,3: 4x4
// #2 @ 3,1: 4x4
// #3 @ 5,5: 2x2
// Visually, these claim the following areas:

// ........
// ...2222.
// ...2222.
// .11XX22.
// .11XX22.
// .111133.
// .111133.
// ........
// The four square inches marked with X are claimed by both 1 and 2. (Claim 3, while adjacent to the others, does not overlap either of them.)

// If the Elves all proceed with their own plans, none of them will have enough fabric. How many square inches of fabric are within two or more claims?

// Your puzzle answer was 104126.

// --- Part Two ---
// Amidst the chaos, you notice that exactly one claim doesn't overlap by even a single square inch of fabric with any other claim. If you can somehow draw attention to it, maybe the Elves will be able to make Santa's suit after all!

// For example, in the claims above, only claim 3 is intact after all claims are made.

// What is the ID of the only claim that doesn't overlap?

const fs = require('file-system');

const prepareData = (data) => {
	const rowsOfData = data.toString().split('\n');
	//transforming rows of data to array of claims data: 
	//first corner coordinates (x,y), width and height
	return rowsOfData.map((row) => {
		const rowData = row.split(' @ ').slice(1,2).toString().
		split(': ').toString().split('x').toString().split(',');
		return rowData.map((element) => {
			return Number(element);
		})
	})
}

const hasInch = (arr, x, y) => {
	return x>arr[0] && y>arr[1] && x<=arr[0]+arr[2] && y<=arr[1]+arr[3];
}

const getSquareObject = (claim) => {
	return { 
		first: {
			x: claim[0],
			y: claim[1]
		},
		second: {
			x: claim[0],
			y: claim[1]+claim[3]
		},
		third: {
			x: claim[0]+claim[2],
			y: claim[1]+claim[3]
		},
		fourth: {
			x: claim[0]+claim[2],
			y: claim[1]
		}
	}
}

const isPointThere = (point, claim) => {
	return  point.x >= claim.first.x &&
					point.y >= claim.first.y &&
					point.x <= claim.third.x &&
					point.y <= claim.third.y
}

const isACross = (firstSquare, secondSquare) => {
	return firstSquare.first.x < secondSquare.first.x &&
					firstSquare.first.y > secondSquare.first.y &&
					firstSquare.second.x < secondSquare.second.x &&
					firstSquare.second.y < secondSquare.second.y &&
					firstSquare.third.x > secondSquare.third.x &&
					firstSquare.third.y < secondSquare.third.y &&
					firstSquare.fourth.x > secondSquare.fourth.x &&
					firstSquare.fourth.y > secondSquare.fourth.y
}

const overlap = (firstClaim, secondClaim) => {
	let firstSquare = getSquareObject(firstClaim);
	let secondSquare = getSquareObject(secondClaim);

	return isPointThere(firstSquare.first, secondSquare) ||
					isPointThere(firstSquare.second, secondSquare) ||
					isPointThere(firstSquare.third, secondSquare) ||
					isPointThere(firstSquare.fourth, secondSquare) ||
					isACross(firstSquare, secondSquare);
}

const question1 = () => {
	fs.readFile('./3.txt', (err, data) => {
		const fabricSize = 1000;
		let counter = 0;
		let inchMarked = false;
		const claimsData = prepareData(data);
		for(let i = 0; i<fabricSize; i++){
			for(let j = 0; j<fabricSize; j++){
				inchMarked = false;
				claimsData.some((claim, claimNumber) => {
					if (inchMarked && hasInch(claim, i, j)) {
						counter++;
						return true;
					}
					if (!inchMarked && hasInch(claim, i, j)) {
						inchMarked = true;
					}
				})
			}
		}
		console.log(`There are ${counter} square inches that overlap.`)
	})
}

question1();

const question2 = () => {
	fs.readFile('./3.txt', (err, data) => {
		const overlappingClaims = [];
		let winningClaim = 0;
		let claimCounter = 1;
		const claimsData = prepareData(data);
		claimsData.map((claim, claimNumber) => {
					claimsData.map((secondClaim, secondClaimNumber) => {
						if(!(claimNumber === secondClaimNumber)){
							if(overlap(claim, secondClaim) || overlap(secondClaim, claim)){
								if(overlappingClaims.indexOf(claimNumber+1) === -1)
									overlappingClaims.push(claimNumber+1);
							}
						}
					})
				})
				while(winningClaim === 0) {
					if (overlappingClaims.indexOf(claimCounter) === -1){
						winningClaim = claimCounter;
					}
					claimCounter++;
				}
		console.log('The one good claim has ID of: ' + winningClaim);
	})
}
question2();