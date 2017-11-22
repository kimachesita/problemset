// solutions here
'use strict'
const asyncOp = require('./lib/lib.js').asyncOp;

// Solution for #1. Asynchronous Operations
function doAsync(input){
    let cur_elem = input.splice(0,1)[0],
    len = cur_elem.length;

    for(let elem of cur_elem){
        asyncOp(elem).then(()=>{
            len--;
            if(input.length === 0){
                return;
            }
            if(len === 0){
                doAsync(input);
            }

        });
    }
} 

module.exports = {doAsync};