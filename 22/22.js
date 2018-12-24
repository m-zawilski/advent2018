const { question } = require('./22.lib');

const runQuestion = () => {
	const depth = 10647;
	const target = {
		x: 7,
		y: 770
	}
	const { answer1, answer2 } = question(depth, target);
	console.log(`The total risk level is ${answer1}`);
	console.log(`It takes ${answer2} minutes to get to the rescuee.`);
}

runQuestion();
