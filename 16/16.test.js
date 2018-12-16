const chai = require('chai');
const expect = chai.expect;
const fs = require('file-system');
const { addrTest, 
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
				eqrrTest } = require('./16.lib');

describe('addrTest', function() {
 it('reads from regs numbered A and B and puts it into C', function() {
   expect(addrTest(3,3,2, [0,1,2,3], [0,1,6,3])).to.be.eql(true);
   expect(addrTest(1,2,3, [0,1,3,3], [0,1,3,4])).to.be.eql(true);
   expect(addrTest(0,1,1, [0,1,2,3], [0,1,2,3])).to.be.eql(true);
   expect(addrTest(0,1,3, [0,1,2,3], [0,1,2,3])).to.be.eql(false);
 });
});

describe('addiTest', function() {
 it('reads from regs numbered A adds value B and puts it into C', function() {
   expect(addiTest(3,2,2, [0,1,2,3], [0,1,5,3])).to.be.eql(true);
   expect(addiTest(1,6,3, [0,1,1,1], [0,1,1,7])).to.be.eql(true);
   expect(addiTest(3,1,1, [0,1,2,3], [0,4,2,3])).to.be.eql(true);
   expect(addiTest(0,1,3, [0,1,2,3], [0,1,2,3])).to.be.eql(false);
 });
});

describe('mulrTest', function() {
 it('reads from regs numbered A and B, multiplies and puts it into C', function() {
   expect(mulrTest(3,3,2, [0,1,2,3], [0,1,9,3])).to.be.eql(true);
   expect(mulrTest(1,2,3, [0,1,3,3], [0,1,3,3])).to.be.eql(true);
   expect(mulrTest(2,1,1, [0,1,2,3], [0,2,2,3])).to.be.eql(true);
   expect(mulrTest(0,1,3, [0,1,2,3], [0,1,2,3])).to.be.eql(false);
 });
});

describe('muliTest', function() {
 it('reads from regs numbered A multiplies by value B and puts it into C', function() {
   expect(muliTest(3,2,2, [0,1,2,3], [0,1,6,3])).to.be.eql(true);
   expect(muliTest(1,6,3, [0,1,1,1], [0,1,1,6])).to.be.eql(true);
   expect(muliTest(3,1,1, [0,1,2,3], [0,3,2,3])).to.be.eql(true);
   expect(muliTest(0,1,3, [0,1,2,3], [0,1,2,3])).to.be.eql(false);
 });
});

describe('banrTest', function() {
 it('reads from regs numbered A and B, bitwise ANDs them and puts it into C', function() {
   expect(banrTest(3,3,2, [0,1,2,3], [0,1,3,3])).to.be.eql(true);
   expect(banrTest(1,2,3, [0,1,3,3], [0,1,3,1])).to.be.eql(true);
   expect(banrTest(2,1,1, [0,1,2,3], [0,0,2,3])).to.be.eql(true);
   expect(banrTest(0,1,3, [0,1,2,3], [0,1,2,3])).to.be.eql(false);
 });
});

describe('baniTest', function() {
 it('reads from regs numbered A bitwise ANDs by value B and puts it into C', function() {
   expect(baniTest(3,2,2, [0,1,2,3], [0,1,2,3])).to.be.eql(true);
   expect(baniTest(1,6,3, [0,1,1,1], [0,1,1,0])).to.be.eql(true);
   expect(baniTest(3,1,1, [0,1,2,3], [0,1,2,3])).to.be.eql(true);
   expect(baniTest(0,1,3, [0,1,2,3], [0,1,2,3])).to.be.eql(false);
 });
});

describe('borrTest', function() {
 it('reads from regs numbered A and B, bitwise ORs them and puts it into C', function() {
   expect(borrTest(3,3,2, [0,1,2,3], [0,1,3,3])).to.be.eql(true);
   expect(borrTest(1,2,3, [0,1,3,3], [0,1,3,3])).to.be.eql(true);
   expect(borrTest(2,1,1, [0,1,2,3], [0,3,2,3])).to.be.eql(true);
   expect(borrTest(0,1,3, [0,1,2,3], [0,1,2,0])).to.be.eql(false);
 });
});

describe('boriTest', function() {
 it('reads from regs numbered A bitwise ORs by value B and puts it into C', function() {
   expect(boriTest(3,2,2, [0,1,2,3], [0,1,3,3])).to.be.eql(true);
   expect(boriTest(1,6,3, [0,1,1,1], [0,1,1,7])).to.be.eql(true);
   expect(boriTest(3,1,1, [0,1,2,3], [0,3,2,3])).to.be.eql(true);
   expect(boriTest(0,1,3, [0,1,2,3], [0,1,2,0])).to.be.eql(false);
 });
});

describe('setrTest', function() {
 it('reads from regs numbered A and puts it into C', function() {
   expect(setrTest(3,3,2, [0,1,2,3], [0,1,3,3])).to.be.eql(true);
   expect(setrTest(1,2,3, [0,1,3,3], [0,1,3,1])).to.be.eql(true);
   expect(setrTest(2,1,1, [0,1,2,3], [0,2,2,3])).to.be.eql(true);
   expect(setrTest(0,1,3, [0,1,2,3], [0,1,2,3])).to.be.eql(false);
 });
});

describe('setiTest', function() {
 it('puts value A into C', function() {
   expect(setiTest(3,2,2, [0,1,2,3], [0,1,3,3])).to.be.eql(true);
   expect(setiTest(1,6,3, [0,1,1,1], [0,1,1,1])).to.be.eql(true);
   expect(setiTest(3,1,1, [0,1,2,3], [0,3,2,3])).to.be.eql(true);
   expect(setiTest(0,1,3, [0,1,2,3], [0,1,2,3])).to.be.eql(false);
 });
});

describe('gtirTest', function() {
 it('checks if value A is greater than register numbered B and puts 1/0 in C', function() {
   expect(gtirTest(3,3,2, [0,1,2,3], [0,1,0,3])).to.be.eql(true);
   expect(gtirTest(1,2,3, [0,1,3,3], [0,1,3,0])).to.be.eql(true);
   expect(gtirTest(2,1,1, [0,1,2,3], [0,1,2,3])).to.be.eql(true);
   expect(gtirTest(0,1,3, [0,1,2,3], [0,1,2,1])).to.be.eql(false);
 });
});

describe('gtriTest', function() {
 it('checks if register numbered A is greater than value B and puts 1/0 in C', function() {
   expect(gtriTest(3,3,2, [0,1,2,3], [0,1,0,3])).to.be.eql(true);
   expect(gtriTest(1,2,3, [0,3,3,3], [0,3,3,1])).to.be.eql(true);
   expect(gtriTest(2,1,1, [0,1,2,3], [0,1,2,3])).to.be.eql(true);
   expect(gtriTest(0,1,3, [0,1,2,3], [0,1,2,1])).to.be.eql(false);
 });
});

describe('gtrrTest', function() {
 it('checks if register numbered A is greater than register numbered B and puts 1/0 in C', function() {
   expect(gtrrTest(3,2,2, [0,1,2,3], [0,1,1,3])).to.be.eql(true);
   expect(gtrrTest(1,2,3, [0,1,3,3], [0,1,3,0])).to.be.eql(true);
   expect(gtrrTest(2,1,1, [0,1,2,3], [0,1,2,3])).to.be.eql(true);
   expect(gtrrTest(0,1,3, [0,1,2,3], [0,1,2,1])).to.be.eql(false);
 });
});

describe('eqirTest', function() {
 it('checks if value A is equal to register numbered B and puts 1/0 in C', function() {
   expect(eqirTest(3,3,2, [0,1,2,3], [0,1,1,3])).to.be.eql(true);
   expect(eqirTest(1,2,3, [0,1,3,3], [0,1,3,0])).to.be.eql(true);
   expect(eqirTest(1,1,3, [0,1,2,3], [0,1,2,1])).to.be.eql(true);
   expect(eqirTest(0,1,3, [0,1,2,3], [0,1,2,1])).to.be.eql(false);
 });
});

describe('eqriTest', function() {
 it('checks if register numbered A is equal to value B and puts 1/0 in C', function() {
   expect(eqriTest(3,3,2, [0,1,2,3], [0,1,1,3])).to.be.eql(true);
   expect(eqriTest(1,2,3, [0,3,3,3], [0,3,3,0])).to.be.eql(true);
   expect(eqriTest(2,1,1, [0,1,2,3], [0,0,2,3])).to.be.eql(true);
   expect(eqriTest(0,1,3, [0,1,2,3], [0,1,2,1])).to.be.eql(false);
 });
});

describe('eqrrTest', function() {
 it('checks if register numbered A is equal to register numbered B and puts 1/0 in C', function() {
   expect(eqrrTest(3,2,2, [0,1,2,3], [0,1,0,3])).to.be.eql(true);
   expect(eqrrTest(3,2,3, [0,1,3,3], [0,1,3,1])).to.be.eql(true);
   expect(eqrrTest(2,1,1, [0,1,2,3], [0,0,2,3])).to.be.eql(true);
   expect(eqrrTest(0,1,3, [0,1,2,3], [0,1,2,1])).to.be.eql(false);
 });
});

describe('question1', function() {
	it('first question answer is still valid', function() {
	fs.readFile('./16a.txt', (err, data) => {
   expect(question1(data)).to.be.eql(531);
  });
 });
});



