// solutions here
'use strict'
const asyncOp = require('./lib/lib.js').asyncOp;

// Solution for #1. Asynchronous Operations
function doAsync(input){
    let cur_elem = input.splice(0,1)[0],    // get first element of input
    len = cur_elem.length;                  // determines if the element is a single value

    // iterate on each value of the first element
    for(let val of cur_elem){
        asyncOp(val).then(()=>{
            len--;                          //tracks the number of promises done on a parallel execution
            if(input.length === 0){
                return;                     
            }
            if(len === 0){
                doAsync(input);             //proceed to next element of input if completed
            }
        });
    }
} 

module.exports = {doAsync};