var mocha = require('mocha');
var assert = require('assert');
var path = require('path');
var Reader = require('../src/Reader.js');
var Token = require('../src/Token.js');
var Lexer = require('../src/Lexer.js');

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

describe('Lexer.js', function(){
  it('should be able to read the input stream',function(){
    var charReader = Reader(path.join(__dirname,'test.txt'));
    var lexdata = []; 
    charReader.on('readable',function(){
      var chunk;
      var lexer = new Lexer(charReader);
      
      lexer.consume();
      chunk = lexer.getCurrentChar();
      while(chunk != null){
        lexdata.push(chunk);
        lexer.consume();
        chunk = lexer.getCurrentChar();
      }
      assert.deepEqual(lexdata,'Hello, world!\n'.split(''));
    });
  });
});


