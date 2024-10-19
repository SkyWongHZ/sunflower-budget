// import {randomInt} from 'crypto';
const {
  randomInt,
} = await import('node:crypto');

const  n= randomInt(1,100);
console.log('n: ', n);