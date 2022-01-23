const {odd, even} = require('./var');
const checkNum = require('./func');
// import {odd, even} from './var';
// import { checkOddOrEven } from './func';


function checkStringOddOrEven(str){
    if(str.length%2){
        return odd;
    }
    return even;
}

console.log(checkNum(10));
console.log(checkStringOddOrEven('hello'));