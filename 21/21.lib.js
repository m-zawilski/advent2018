const addr = (A, B, C, registers) => {
	registers[C] = registers[A] + registers[B];
	return registers;
}

const addi = (A, B, C, registers) => {
	registers[C] = registers[A] + B;
}

const mulr = (A, B, C, registers) => {
	registers[C] = registers[A] * registers[B];
}

const muli = (A, B, C, registers) => {
	registers[C] = registers[A] * B;
}

const banr = (A, B, C, registers) => {
	registers[C] = registers[A] & registers[B];
}

const bani = (A, B, C, registers) => {
	registers[C] = registers[A] & B;
}

const borr = (A, B, C, registers) => {
	registers[C] = registers[A] | registers[B];
}

const bori = (A, B, C, registers) => {
	registers[C] = registers[A] | B;
}

const setr = (A, B, C, registers) => {
	registers[C] = registers[A];
}

const seti = (A, B, C, registers) => {
	registers[C] = A;
}

const gtir = (A, B, C, registers) => {
	registers[C] = (A>registers[B]) ? 1 : 0;
}

const gtri = (A, B, C, registers) => {
	registers[C] = (registers[A]>B) ? 1 : 0;
}

const gtrr = (A, B, C, registers) => {
	registers[C] = (registers[A]>registers[B]) ? 1 : 0;
}

const eqir = (A, B, C, registers) => {
	registers[C] = (A===registers[B]) ? 1 : 0;
}

const eqri = (A, B, C, registers) => {
	registers[C] = (registers[A]===B) ? 1 : 0;
}

const eqrr = (A, B, C, registers) => {
	registers[C] = (registers[A]===registers[B]) ? 1 : 0;
}


const readData = (data) => {
	const pointer = data[0].split(' ')[1];
	const instructionLines = data.splice(1,data.length-1).map((ins) => {
		const instructionLine = ins.split(' ');
		return {
			name: instructionLine[0],
			firstArg: Number(instructionLine[1]),
			secondArg: Number(instructionLine[2]),
			thirdArg: Number(instructionLine[3]),
		}
	})
	return {
		pointer: pointer,
		instructionLines: instructionLines
	}
}

const runInstruction = (pointer, instructionLines, registers) => {
	const instructionNames = [addi, addr, mulr, muli, banr, bani,
													  borr, bori, setr, seti, gtir, gtri,
								 						gtrr, eqir, eqri, eqrr];
	const instructionNumber = registers[pointer];
	instructionNames.some((ins) => {
		const currentLine = instructionLines[instructionNumber];
		if(ins.name === currentLine.name){
			ins(currentLine.firstArg, currentLine.secondArg, currentLine.thirdArg, registers);
			registers[pointer]++;
		}
	})
	return registers;
}

const isValueInArray = (val, array) => {
	return array.some((v) => {
		if(v.value === val) return true;
	})
}

const runRealInstruction = (registers, qNumber) => {
	let valuesThatMatch = [];
	let counter = 0;
	while(true){
		registers[3] = registers[4] | 65536;
		registers[4] = 14464005;
		while(true){
			registers[2] = registers[3] & 255;
			registers[4] += registers[2];
			registers[4] = registers[4] & 16777215;
			registers[4] *= 65899;
			registers[4] = registers[4] & 16777215;
			if(256>registers[3]){
				if(qNumber===1){
					return registers[4];
				} else if (qNumber === 2) {
					if(!isValueInArray(registers[4], valuesThatMatch)){
						valuesThatMatch.push({
							value: registers[4],
							counter: counter
						})
					} else {
						valuesThatMatch = valuesThatMatch.sort((a1, a2) => {
							return a1.counter-a2.counter;
						})
						return valuesThatMatch[valuesThatMatch.length-1].value;
					}
				}
				break;
			} else {
				registers[3] = Math.floor(registers[3]/256);
			}
		}		
	}
}

const findAnswer = (instructionLines, qNumber) => {
	let registers = [0,0,0,0,0,0];
	let answer;
	if(qNumber === 1){
		answer = runRealInstruction(registers, qNumber);
	} else if (qNumber === 2){
		answer = runRealInstruction(registers, qNumber);
	}
	return answer;
}

const question1 = (data) => {
	const { instructionLines } = readData(data.toString().split('\n'));
	const answer = findAnswer(instructionLines, 1);
	return answer;
}

const question2 = (data) => {
	const { instructionLines } = readData(data.toString().split('\n'));
	const answer = findAnswer(instructionLines, 2);
	return answer;
}

module.exports = {
	question1,
	question2
}