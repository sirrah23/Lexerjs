var mocha = require('mocha');
var assert = require('assert');
var path = require('path');
var Reader = require('../src/Reader.js');
var Token = require('../src/Token.js');

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

describe('Token.js', function(){
  it('should be initialized properly',function(){
    var token = new Token('file.foo', 123, 'NUMBER');
    assert.equal(token.getSource(),'file.foo');
    assert.equal(token.getContents(),123);
    assert.equal(token.getType(),'NUMBER'); 
  });
});
