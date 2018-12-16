const addrTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = registersBefore[A] + registersBefore[B];
	return checkedRegister === afterOpcode;
}

const addiTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = registersBefore[A] + B;
	return checkedRegister === afterOpcode;
}

const mulrTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = registersBefore[A] * registersBefore[B];
	return checkedRegister === afterOpcode;
}

const muliTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = registersBefore[A] * B;
	return checkedRegister === afterOpcode;
}

const banrTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = registersBefore[A] & registersBefore[B];
	return checkedRegister === afterOpcode;
}

const baniTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = registersBefore[A] & B;
	return checkedRegister === afterOpcode;
}

const borrTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = registersBefore[A] | registersBefore[B];
	return checkedRegister === afterOpcode;
}

const boriTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = registersBefore[A] | B;
	return checkedRegister === afterOpcode;
}

const setrTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = registersBefore[A];
	return checkedRegister === afterOpcode;
}

const setiTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = A;
	return checkedRegister === afterOpcode;
}

const gtirTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = (A>registersBefore[B]) ? 1 : 0;
	return checkedRegister === afterOpcode;
}

const gtriTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = (registersBefore[A]>B) ? 1 : 0;
	return checkedRegister === afterOpcode;
}

const gtrrTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = (registersBefore[A]>registersBefore[B]) ? 1 : 0;
	return checkedRegister === afterOpcode;
}

const eqirTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = (A===registersBefore[B]) ? 1 : 0;
	return checkedRegister === afterOpcode;
}

const eqriTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = (registersBefore[A]===B) ? 1 : 0;
	return checkedRegister === afterOpcode;
}

const eqrrTest = (A, B, C, registersBefore, registersAfter) => {
	const checkedRegister = registersAfter[C];
	const afterOpcode = (registersBefore[A]===registersBefore[B]) ? 1 : 0;
	return checkedRegister === afterOpcode;
}

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

const prepareData1 = (data) => {
	return data.toString().split('\n\n').map((sample) => {
		const lines = sample.split('\n');
		const before = [];
		const after = [];
		lines[0].split(' [')[1].split(']')[0].split(', ').map((el) => {
			before.push(Number(el));
		})
		lines[2].split(' [')[1].split(']')[0].split(', ').map((el) => {
			after.push(Number(el));
		})
		return {
			optCode: Number(lines[1].split(' ')[0]),
			A: Number(lines[1].split(' ')[1]),
			B: Number(lines[1].split(' ')[2]),
			C: Number(lines[1].split(' ')[3]),
			before: before,
			after: after
		}
	})
}

const prepareData2 = (data) => {
	return data.toString().split('\n').map((line) => {
		const splitted = line.split(' ');
		return {
			optCode: Number(splitted[0]),
			A: Number(splitted[1]),
			B: Number(splitted[2]),
			C: Number(splitted[3]),
		}
	})
}

const runTests = (inp, tests) => {
	let passed = [];
	tests.map((test, i) => {
		if(test(inp.A, inp.B, inp.C, inp.before, inp.after)) passed.push(i);
	})
	return passed;
}

const question1 = (data) => {
	const tests = [addiTest, addrTest, mulrTest, muliTest, banrTest, baniTest,
								 borrTest, boriTest, setrTest, setiTest, gtirTest, gtriTest,
								 gtrrTest, eqirTest, eqriTest, eqrrTest];
	const input = prepareData1(data);
	let counter = 0;
	input.map((inp) => {
		const passed = runTests(inp, tests);
		if(passed.length >= 3) counter++;
	})
	return counter;
}

const addFoundTest = (found, inp, tests, passed, input1, commands) => {
	const command = commands.map((c) => {
		return c.name;
	}).indexOf(tests[passed[0]].name.substr(0,4));
	found.push({
		optCode: inp.optCode,
		func: commands[command]
	})
	let index = tests.indexOf(tests[passed[0]]);
	tests.splice(index, 1);
	return input1.filter((otherInput) => {
		if(otherInput.optCode === inp.optCode) return false;
		return true;
	})
}

const question2discovery = (data) => {
	const tests = [addiTest, addrTest, mulrTest, muliTest, banrTest, baniTest,
								 borrTest, boriTest, setrTest, setiTest, gtirTest, gtriTest,
								 gtrrTest, eqirTest, eqriTest, eqrrTest];
	const commands = [addi, addr, mulr, muli, banr, bani,
								 borr, bori, setr, seti, gtir, gtri,
								 gtrr, eqir, eqri, eqrr];
	const length = tests.length;
	let input1 = prepareData1(data);
	const found = [];
	while(found.length!==length){
		input1.map((inp, i) => {
			const passed = runTests(inp, tests);
			if(passed.length === 1) {
				if(found.length === 0){
					input1 = addFoundTest(found, inp, tests, passed, input1, commands);
				} else {
					notHere = true;
					found.map((f) => {
						if(f.optCode === inp.optCode) {
							notHere = false;
						} 
					})
					if(notHere){
						input1 = addFoundTest(found, inp, tests, passed, input1, commands);
					}
				}
			}
		})
	}
	return found
}

const runCommand = (command, codes, registers) => {
	const instruction = codes.filter((code) => {
		if(code.optCode === command.optCode) return true;
		return false;
	})
	instruction[0].func(command.A, command.B, command.C, registers);
}

const question2 = (data, codes) => {
	const instructions = prepareData2(data);
	const registers = [0,0,0,0];
	instructions.map((command) => {
		runCommand(command, codes, registers);
	})
	return registers[0];
}

module.exports = {
	addrTest,
	addiTest,
	mulrTest,
	muliTest,
	banrTest,
	baniTest,
	borrTest,
	boriTest,
	setrTest,
	setiTest,
	gtirTest,
	gtriTest,
	gtrrTest,
	eqirTest,
	eqriTest,
	eqrrTest,
	question1,
	question2discovery,
	question2
}