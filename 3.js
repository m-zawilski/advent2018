const fs = require('file-system');
// How many square inches of fabric are within two or more claims?

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
		const rowsOfData = data.toString().split('\n');
		//transforming rows of data to array of claims data: 
		//first corner coordinates (x,y), width and height
		const claimsData = rowsOfData.map((row) => {
			const rowData = row.split(' @ ').slice(1,2).toString().
			split(': ').toString().split('x').toString().split(',');
			return rowData.map((element) => {
				return Number(element);
			})
		})
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

// What is the ID of the only claim that doesn't overlap?
const question2 = () => {
	fs.readFile('./3.txt', (err, data) => {
		const overlappingClaims = [];
		let winningClaim = 0;
		let claimCounter = 1;
		const rowsOfData = data.toString().split('\n');
		//transforming rows of data to array of claims data: 
		//first corner coordinates (x,y), width and height
		const claimsData = rowsOfData.map((row) => {
			const rowData = row.split(' @ ').slice(1,2).toString().
			split(': ').toString().split('x').toString().split(',');
			return rowData.map((element) => {
				return Number(element);
			})
		})
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