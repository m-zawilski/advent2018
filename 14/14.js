const { question } = require('./14.lib')

const input = '864801';

console.log(`The first 10 recepies after ${input}st are ${question(input, 1)}`);
console.log(`The pattern ${input} appears after ${question(input,2)} recipes.`);