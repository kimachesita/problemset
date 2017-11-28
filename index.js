// solutions here
'use strict'
const asyncOp = require('./lib/lib.js').asyncOp;
const RandStream = require('./lib/lib.js').RandStream;
const events = require('events');

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

// Solution for #2. Streams
class RandStringSource extends events.EventEmitter{
    constructor(stream_source){
        super();
        this.stream = stream_source;
        this.payload = '';                                  //store payload until complete
        this.eat();                                         //state machine parser implementation
    }

    eat(){
       this.stream.on('data',(chunk)=>{                     //add stream 'data' listener
            for(let i=0;i<chunk.length;i++){
                if(chunk.charAt(i) != '.'){
                    this.payload += chunk.charAt(i);        //store payload
                }else{
                    this.emit('data',this.payload);         //raise event 
                    this.payload = '';                      //empty temp payload holder
                }
            }
       });
    }
}

module.exports = {
    doAsync,
    RandStringSource
};