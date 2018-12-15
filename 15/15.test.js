const chai = require('chai');
const expect = chai.expect;
const { getTotalHealth, 
				gravetaking, 
				move, 
				areEnemiesAlive,
				isEnemyNearby } = require('./15.lib');

describe('getTotalHealth', function() {
  it('function returns a number', function() {
    expect(getTotalHealth([{health: 40}, {health: 50}])).to.be.a('number');
  });
  it('function returns a sum of objects positive health', function() {
    expect(getTotalHealth([{health: 50}, {health: 50}, {health: 50}])).to.be.eql(150);
  });
  it('function ignores 0 or minus health', function() {
    expect(getTotalHealth([{health: 0}, {health: 50}, {health: 50}])).to.be.eql(100);
    expect(getTotalHealth([{health: -10}, {health: 50}, {health: 50}])).to.be.eql(100);
  });
});

describe('gravetaking', function() {
  it('function gets rid of dead units', function() {
  	expect(gravetaking([{alive: true}, {alive: false}])).to.not.include({alive: false});
  	expect(gravetaking([{alive: true}, {alive: false}]).length).to.be.eql(1);
  })
  it('function does not affect alive units', function() {
  	expect(gravetaking([{alive: true}, {alive: true}]).length).to.be.eql(2);
  })
})

describe('move', function() {
  it('objects coordinates change accordingly with the direction string', function() {
  	expect(move({x: 10, y: 10}, 'left')).to.be.eql({x: 9, y: 10});
		expect(move({x: 10, y: 10}, 'right')).to.be.eql({x: 11, y: 10});
		expect(move({x: 10, y: 10}, 'up')).to.be.eql({x: 10, y: 9});
  	expect(move({x: 10, y: 10}, 'down')).to.be.eql({x: 10, y: 11});
  })
  it('other values do not change coordinates', function() {
  	expect(move({x: 10, y: 10}, 'apple')).to.be.eql({x: 10, y: 10});
  	expect(move({x: 10, y: 10}, null)).to.be.eql({x: 10, y: 10});
  })
})

describe('areEnemiesAlive', function() {
  it('returns false if only units of one type are on the field', function() {
  	expect(areEnemiesAlive({symbol: 'G'}, [{symbol: 'G'}, {symbol: 'G'}])).to.be.eql(false);
  	expect(areEnemiesAlive({symbol: 'E'}, [{symbol: 'E'}, {symbol: 'E'}])).to.be.eql(false);
  })
  it('returns true if there are still alive units of other types', function() {
  	expect(areEnemiesAlive({symbol: 'G'}, [{symbol: 'E'}, {symbol: 'G'}])).to.be.eql(true);
  	expect(areEnemiesAlive({symbol: 'E'}, [{symbol: 'G'}, {symbol: 'E'}])).to.be.eql(true);
  })
})

describe('isEnemyNearby', function() {
  it('returns true if there is an enemy adjacent', function() {
  	expect(isEnemyNearby({symbol: 'G', adjacent: 
  		[{symbol: 'E'}, {symbol: 'G'}, {symbol: '.'}, {symbol: '.'}]})).to.be.eql(true);
  	expect(isEnemyNearby({symbol: 'E', adjacent: 
  		[{symbol: 'E'}, {symbol: 'G'}, {symbol: '.'}, {symbol: '.'}]})).to.be.eql(true);
  	expect(isEnemyNearby({symbol: 'G', adjacent: 
  		[{symbol: 'E'}, {symbol: '.'}, {symbol: '.'}, {symbol: '.'}]})).to.be.eql(true);
  	expect(isEnemyNearby({symbol: 'E', adjacent: 
  		[{symbol: '.'}, {symbol: 'G'}, {symbol: '.'}, {symbol: '.'}]})).to.be.eql(true);
  })
  it('returns false if all nearby fields are empty', function() {
  	expect(isEnemyNearby({symbol: 'G', adjacent: 
  		[{symbol: '.'}, {symbol: '.'}, {symbol: '.'}, {symbol: '.'}]})).to.be.eql(false);
  	expect(isEnemyNearby({symbol: 'G', adjacent: 
  		[{symbol: '.'}, {symbol: '.'}]})).to.be.eql(false);
  	expect(isEnemyNearby({symbol: 'G', adjacent: []})).to.be.eql(false);
  })
  it('returns false if there are only units of the same type adjacent', function() {
  	expect(isEnemyNearby({symbol: 'G', adjacent: 
  		[{symbol: '.'}, {symbol: 'G'}, {symbol: '.'}, {symbol: '.'}]})).to.be.eql(false);
  	expect(isEnemyNearby({symbol: 'E', adjacent: 
  		[{symbol: '.'}, {symbol: 'E'}, {symbol: '.'}, {symbol: '.'}]})).to.be.eql(false);
  })
})


