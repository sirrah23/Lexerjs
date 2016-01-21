var mocha = require('mocha');
var assert = require('assert');
var path = require('path');
var Reader = require('../src/Reader.js');
var Token = require('../src/Token.js');
var Lexer = require('../src/Lexer.js');

/*
* Abstract away function that makes sure
* done is only called once, used to get
* around the "readable" event being raised
* again after the buffer is empty (null)
*/
function Finisher(done){
  var expected = 1;
  return function(){
    if(expected > 0){
      expected--;
      done();
    }
  }
}

describe('Reader.js',function(){
  it('should read one character at a time',function(done){
    var data = [];
    var chunk;
    var finisher = new Finisher(done);
    var charReader = Reader(path.join(__dirname,'test.txt'));
    charReader.on('readable',function(){
      while(null != (chunk = charReader.read(1))){
        data.push(chunk);
      }
      assert.deepEqual(data,'Hello, world!\n'.split(''));
      finisher();
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
  it('should be able to read the input stream',function(done){
    var finisher = new Finisher(done);
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
      finisher();
    });
  });

  it('should skip over spaces and other junk characters', function(done){
    var finisher = new Finisher(done);
    var charReader = Reader(path.join(__dirname,'test3.txt'));
    var lexdata = [];
    charReader.on('readable',function(){
      var chunk;
      var lexer = new Lexer(charReader);
      lexer.eatLayout();
      chunk = lexer.getCurrentChar();
      while(chunk != null){
        lexdata.push(chunk);
        lexer.consume();
        chunk = lexer.getCurrentChar();
      }
      assert.deepEqual(lexdata,'Hello, world!\n'.split(''));
      finisher();
    });
  });

  it('should tokenize numbers', function(done){
    var finisher = new Finisher(done);
    var charReader = Reader(path.join(__dirname,'digittest.txt'));
    var lexdata = [];
    charReader.on('readable',function(){
      var chunk;
      var lexer = new Lexer(charReader);
      while (lexer.isRunning()){
        lexer.getNextToken();
      }
      assert.deepEqual(lexer.getTokens().map(function(t){return t.getContents()}),'1234 567'.split(' '));
      finisher();
    });
  });

  it('should tokenize letter only identifiers', function(done){
    var finisher = new Finisher(done);
    var charReader = Reader(path.join(__dirname,'identest.txt'));
    var lexdata = [];
    charReader.on('readable',function(){
      var chunk;
      var lexer = new Lexer(charReader);
      while (lexer.isRunning()){
        lexer.getNextToken();
      }
      assert.deepEqual(lexer.getTokens().map(function(t){return t.getContents()}),'Hello World'.split(' '));
      finisher();
    });
  });

  it('should tokenize digits and identifiers', function(done){
    var finisher = new Finisher(done);
    var charReader = Reader(path.join(__dirname,'identest2.txt'));
    var lexdata = [];
    charReader.on('readable',function(){
      var chunk;
      var lexer = new Lexer(charReader);
      while (lexer.isRunning()){
        lexer.getNextToken();
      }
      assert.deepEqual(lexer
        .getTokens()
        .map(function(t){return t.getContents()}),['Hello123','World','456','This','Is','A','Test']);
      finisher();
    });
  });
});
