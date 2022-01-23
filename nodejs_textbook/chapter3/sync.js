// 동기 메서드 (이름 끝에 sync 붙음)
// 비효율적,,

const fs = require('fs');

console.log('시작');

let data = fs.readFileSync('./readme2.txt');
console.log('1번 : ',data.toString());

data = fs.readFileSync('./readme2.txt');
console.log('2번 : ',data.toString());

data = fs.readFileSync('./readme2.txt');
console.log('3번 : ',data.toString());

console.log('끝!!');