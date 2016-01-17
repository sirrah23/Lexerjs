var mocha = require('mocha');
var assert = require('assert');
var path = require('path');
var Reader = require('../src/Reader.js');
var Token = require('../src/Token.js');
var Lexer = require('../src/Lexer.js');

describe('Reader.js',function(){
  it('should read one character at a time',function(done){
    var data = [];
    var chunk;
    var expected = 1;
    function checkDone(){
      if(expected>0){
        expected--;
        done();
      }
    }
    var charReader = Reader(path.join(__dirname,'test.txt'));
    charReader.on('readable',function(){
      while(null != (chunk = charReader.read(1))){
        data.push(chunk);
      }
      assert.deepEqual(data,'Hello, world!\n'.split(''));
      checkDone(expected);
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
    var expected = 1;
    function checkDone(){
      if(expected>0){
        expected--;
        done();
      }
    }
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
      checkDone();
    });
  });

  it('should skip over spaces and other junk characters', function(done){
    var expected = 1;
    function checkDone(){
      if(expected>0){
        expected--;
        done();
      }
    }
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
      checkDone();
    });
  });

  it('should tokenize numbers', function(done){
    var expected = 1;
    function checkDone(){
      if(expected>0){
        expected--;
        done();
      }
    }
    var charReader = Reader(path.join(__dirname,'digittest.txt'));
    var lexdata = [];
    charReader.on('readable',function(){
      var chunk;
      var lexer = new Lexer(charReader);
      while (lexer.isRunning()){
        lexer.getNextToken();
      }
      assert.deepEqual(lexer.getTokens().map(function(t){return t.getContents()}),'1234 567'.split(' '));
      checkDone();
    });
  });

  it('should tokenize identifiers', function(done){
    var expected = 1;
    function checkDone(){
      if(expected>0){
        expected--;
        done();
      }
    }
    var charReader = Reader(path.join(__dirname,'identest.txt'));
    var lexdata = [];
    charReader.on('readable',function(){
      var chunk;
      var lexer = new Lexer(charReader);
      while (lexer.isRunning()){
        lexer.getNextToken();
      }
      assert.deepEqual(lexer.getTokens().map(function(t){return t.getContents()}),'Hello World'.split(' '));
      checkDone();
    });
  });
});
