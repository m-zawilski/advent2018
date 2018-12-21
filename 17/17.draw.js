const fs = require('file-system');

const { drawToFile } = require('./17.lib');

const draw = () => {
	fs.readFile('./17.txt', (err, data) => {
		drawToFile(data);
	})
}

draw();