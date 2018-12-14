const chai = require('chai');
const expect = chai.expect;
const { getNewValues, getTenRecipesAfter, whenPatternAppears, checkPattern } = require('./14.lib');

describe('getNewValues', function() {
  it('function returns array', function() {
    expect(getNewValues({value: 1}, {value: 3})).to.be.an('array');
  });
  it('elements of array are numbers', function() {
    expect(getNewValues({value: 1}, {value: 3})[0]).to.be.a('number');
    expect(getNewValues({value: 7}, {value: 5})[1]).to.be.a('number');
  });
  it('sum below 10 returns one element', function() {
    expect(getNewValues({value: 1}, {value: 3}).length).to.eql(1);
    expect(getNewValues({value: 5}, {value: 3}).length).to.eql(1);
  });
   it('sum >= 10 returns two elements', function() {
    expect(getNewValues({value: 5}, {value: 5}).length).to.eql(2);
    expect(getNewValues({value: 9}, {value: 9}).length).to.eql(2);
  });
});

describe('getTenRecipesAfter', function() {
	it('returns string', function(){
		expect(getTenRecipesAfter(10)).to.be.a('string');
	});
	it('returns 10 digits', function(){
		expect(getTenRecipesAfter(10).length).to.eql(10);
	});
  it('returns outputs as at the website', function() {
    expect(getTenRecipesAfter('9')).to.be.eql('5158916779');
    expect(getTenRecipesAfter('2018')).to.be.eql('5941429882');
    expect(getTenRecipesAfter('5')).to.be.eql('0124515891');
    expect(getTenRecipesAfter('18')).to.be.eql('9251071085');
  });
});

describe('checkPattern', function() {
	it('returns a boolean', function() {
		expect(checkPattern([1,2,3], [3,2,1])).to.be.a('boolean');
	});
	it('matches identical arrays of different types', function() {
		expect(checkPattern(['a', 'b', 'c'], ['a', 'b', 'c'])).to.eql(true);
		expect(checkPattern(['a', 'a', 'c'], ['a', 'b', 'c'])).to.eql(false);
		expect(checkPattern([1, 2, 3], ['1', '2', '3'])).to.eql(true);
		expect(checkPattern(['1', '2', '3'], [1, 2, 3])).to.eql(true);
	});
})

describe('whenPatternAppears', function() {
	it('returns a number', function() {
		expect(whenPatternAppears('01245')).to.be.a('number');
	});
	it('returns outputs as at the website', function() {
		expect(whenPatternAppears('51589')).to.be.eql(9);
		expect(whenPatternAppears('01245')).to.be.eql(5);
		expect(whenPatternAppears('92510')).to.be.eql(18);
		expect(whenPatternAppears('59414')).to.be.eql(2018);
	});
});


