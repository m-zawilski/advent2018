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

const getFinalRegisters = (pointer, instructionLines, registers) => {
	while(registers[pointer] <= instructionLines.length){
		registers = runInstruction(pointer, instructionLines, registers);
	}
	return registers;
}

const getFinalRegistersCheck = (pointer, instructionLines, registers) => {
	let found = false;
	for(let x = 0; x<10000; x++){
		registers = runInstruction(pointer, instructionLines, registers);
		if(registers[pointer] > instructionLines.length) found = true;
	}
	return found;
}

const areSomeRegistersLooped = (noOfCalls) => {
	let loopFound = false;
	noOfCalls.map((number) => {
		if(number > 100){
			if(!noOfCalls.some((otherNumber) => {	//to return start of a loop 
				if (otherNumber+1 === number) return true;
			})){
				loopFound = true;
			}
		}
	})
	return loopFound;
}

const countCalls = (pointer, instructionLines, registers) => {
	const noOfCalls = [];
	let loopFound = false;
	for(let i = 0; i<instructionLines.length; i++){
		noOfCalls.push(0);
	}
	while(!loopFound){
		registers = runInstruction(pointer, instructionLines, registers);
		noOfCalls[registers[pointer]]++;
		loopFound = areSomeRegistersLooped(noOfCalls)
	}
	return {
		instructionsCalls: noOfCalls,
		loopedRegisters: registers
	}
}

const getLoopLength = (pointer, instructionLines, loopedRegisters) => {
	const loop = [];
	let firstInstruction = loopedRegisters[pointer];
	loop.push(firstInstruction);
	loopedRegisters = runInstruction(pointer, instructionLines, loopedRegisters);
	let secondInstruction = loopedRegisters[pointer];
	loop.push(secondInstruction);
	let loopFound = false;
	while(!loopFound) {
		loopedRegisters = runInstruction(pointer, 
																			instructionLines, loopedRegisters);
		let instructionNumber = loopedRegisters[pointer];
		if(instructionNumber === firstInstruction){
			loopedRegisters = runInstruction(pointer, 
																				instructionLines, loopedRegisters);
			let nextInstructionNumber = loopedRegisters[pointer];
			if(nextInstructionNumber === secondInstruction) {
				loopFound = true;
			} else {
				loop.push(instructionNumber);
				loop.push(nextInstructionNumber);
			}
		} else {
			loop.push(instructionNumber);
		}
	}
	return loop.length;
}

const checkOneLoopChange = (pointer, instructionLines, loopLength, loopedRegisters) => {
	const beginning = JSON.parse(JSON.stringify(loopedRegisters));
	for(let i = 0; i<loopLength;i++){
		loopedRegisters = runInstruction(pointer, instructionLines, loopedRegisters);
	}
	const end = JSON.parse(JSON.stringify(loopedRegisters));
	const result = [];
	for(let i = 0; i<loopedRegisters.length; i++){
		result.push(end[i]-beginning[i]);
	}
	return result;
}

const question1 = (data) => {
	const { pointer, instructionLines } = readData(data.toString().split('\n'));
	let registers = [0,0,0,0,0,0];
	const finalRegisters = getFinalRegisters(pointer, instructionLines, registers);
	return finalRegisters[0];
}

const testRegisters = (pointer, instructionLines, registers) => {
	const { instructionsCalls, loopedRegisters } = countCalls(pointer, instructionLines, registers);
	const loopLength = getLoopLength(pointer, instructionLines, loopedRegisters);
	const resultsChangeAfterLoop = checkOneLoopChange(pointer, 
																		instructionLines, loopLength, loopedRegisters);
}

const findDivisors = (number) => {
	const divisors = [];
	for(let i = 1; i<=number; i++){
		if(number%i === 0) divisors.push(i);
	}
	return divisors;
}

const question2 = (data) => {
	const { pointer, instructionLines } = readData(data.toString().split('\n'));
	let registers = [1,0,0,0,0,0];
	let { instructionsCalls, loopedRegisters } = countCalls(pointer, instructionLines, registers);
	//testRegisters(pointer, instructionLines, loopedRegisters);
	const bigNumber = loopedRegisters.reduce((sum, reg) => {
		if(reg>sum){
			sum = reg;
		} return sum;
	}, 0);
	const divisorsOfBigNumber = findDivisors(bigNumber);
	const answer = divisorsOfBigNumber.reduce((sum, reg) => {
		return sum + reg;
	}, 0);
	return answer;
}

module.exports = {
	question1,
	question2
}


