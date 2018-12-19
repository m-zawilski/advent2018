const fs = require('file-system');

const getElement = (x, y, type) => {
	return {
		x: x,
		y: y, 
		type: type
	}
}

const getScore = (map) => {
	let treesCounter = 0, lumberyardsCounter = 0;
	map.map((el) => {
		if(el.type==='#') lumberyardsCounter++;
		if(el.type==='|') treesCounter++;
	})
	return treesCounter*lumberyardsCounter;
}

const question1 = () => {
	fs.readFile('./18.txt', (err, data) => {
		const linesOfData = data.toString().split('\n');
		const field = linesOfData.map((line) => {
			return line.split('');
		})
		let map = [];
		field.map((rows, y) => {
			rows.map((cell, x) => {
				map.push(getElement(x, y, cell));
			})
		})
		for(let i = 1; i<50000; i++){
			map = map.map((el, ind1) => {
				let type = el.type;
				const neighbours = [];
				map.map((el2, ind2) => {
					if(ind1===ind2) return;
					if(Math.sqrt(Math.pow(el2.x-el.x,2)+Math.pow(el2.y-el.y,2))<2){
						neighbours.push(el2);
					}
				})
				if(el.type==='|'){
					let count = 0;
					neighbours.map((nbr) => {
						if(nbr.type === '#'){count++;}
					})
					if(count>=3){type='#';}
				} else if (el.type === '#'){
					let hasTree = false, hasLumberyard = false;
					neighbours.map((nbr) => {
						if(nbr.type === '|'){hasTree = true};
						if(nbr.type === '#'){hasLumberyard = true};
					})
					if(!hasTree || !hasLumberyard){type='.';}
				} else {
					let count = 0;
					neighbours.map((nbr) => {
						if(nbr.type === '|'){count++;}
					})
					if(count>=3){type='|';}
				}
				return getElement(el.x, el.y, type);
			})
			let prevScore = 0;
			if(i%100 === 0){
				let newScore = getScore(map);
				console.log(i, newScore - prevScore);
				console.log(newScore);
				prevScore = newScore;
			}
		}
	})
}

question1();