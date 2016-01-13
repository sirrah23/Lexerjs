var mocha = require('mocha');
var assert = require('assert');
var path = require('path');
var Reader = require('../src/Reader.js');

describe('Reader.js',function(done){
  it('should read one character at a time',function(){
    var data = [];
    var chunk;

    var charReader = Reader(path.join(__dirname,'test.txt'));
    charReader.on('readable',function(){
      while(null != (chunk = charReader.read(1))){
        data.push(chunk);
      }
      assert.deepEqual(data,'Hello, world!\n'.split(''));
      done();
    });
  });
});
