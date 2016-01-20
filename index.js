var Reader = require('./src/Reader.js'); //input file reader
var Lexer = require('./src/Lexer.js');  //Lexer
var _ = require('underscore');

var args = process.argv.slice(2);

//If no source file are passed in we can't do anything...
if(args.length == 0){
  console.log("USAGE: node index.js file1.foo file2.foo ... filen.foo");
  return;
}

var inputFile = args[0];
var fileReader = new Reader(inputFile);
var tokenLexemes = [];
var displayTokens = _.once(function(){
  console.log(tokenLexemes);
});

//Read the file one character at a time
fileReader.on('readable',function(){
  var lexer = new Lexer(fileReader);
  //Obtain tokens from file in a loop
  while (lexer.isRunning()){
    lexer.getNextToken();
  }
  //push token lexemes found to global tokens variable
  lexer.getTokens()
       .map(function(t){tokenLexemes.push(t.getContents())})
  displayTokens();
});

