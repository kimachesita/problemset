// solutions here
'use strict'
const asyncOp = require('./lib/lib.js').asyncOp;
const RandStream = require('./lib/lib.js').RandStream;
const events = require('events');

// Solution for #1. Asynchronous Operations
function doAsync(input){
    let cur_elem = input.splice(0,1)[0],                    // process first element of the input
    len = cur_elem.length;                                  // determines how many parallel execution
                                                          
    for(let val of cur_elem){                               // do an asynocOp to each element simulating a parallel execution
        asyncOp(val).then(()=>{
            len--;                                          //tracks the number of promises done on a parallel execution
            if(input.length === 0) return;
            if(len === 0) doAsync(input);                   //proceed to next element of input if completed
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

//solution for #3 Resource Pooling
class ResourceObject extends events.EventEmitter {          //A resource object class
    constructor(){
        super();
        this.available = true;
    }

    reserve(){
        this.available = false;
        return this;
    }

    release(){
        this.available = true;
        this.emit('release');
    }
}

class ResourceManager{
    constructor(count){                                     // create and initialize internal arrays
        this.taskQueue = [];                                // taskQueue - waiting list for unentertained callbacks
        this.resources = [];                                // resources - an array container of all object resources

        for(let i=0;i<count;i++){                           //create resource objects base on count
            let resource = new ResourceObject();
            resource.on('release',()=>{                     //listen for finished task then execute waiting task on the queue
                if(this.taskQueue.length != 0){
                    this.taskQueue.splice(0,1)[0](resource);
                } 
            });
            this.resources.push(resource);
        }
    }

    borrow(callback){     
        let obj = this._findAvailable();                    //find available resource objects first
        if(obj){
            callback(obj.reserve());                        //if resource available execute callback
        }else{
            this.taskQueue.push(callback);                  //if non, put callback to waiting queue
        }
    }   

    _findAvailable(){
        for(let obj of this.resources){
            if(obj.available) return obj;
        }
        return null;
    }
}

module.exports = {
    doAsync,
    RandStringSource,
    ResourceManager
};