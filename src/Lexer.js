/*
 *  This file contains a Lexer module. A Lexer
 *  object is created that reads a file on loop
 *  and returns an array of tokens for that file.
 *
 */
var Token = require('./Token.js');
var path = require('path');

function Lexer(inputStream){
  var inputStream = inputStream;
  var running = true;
  var currentChar = '';
  var currLexeme=[];
  var tokens = [];

  /*GETTERS START*/

  this.getCurrentChar = function(){
    return currentChar;
  }

  this.getTokens = function(){
    return tokens;
  }

  this.getStream = function(){
    return this.inputStream;
  }

  /*GETTERS END*/

  /*Tells you if the lexer is still lexing*/
  this.isRunning = function(){
    return running;
  }

  /*Returns true if input character is a digit*/
  this.isDigit = function(c){
    if (c == null){
      return false;
    }
    return c.match(/[0-9]/);
  }

  /*Returns true if input character is a letter*/
  this.isLetter = function(c){
    if (c == null){
      return false;
    }
    return c.match(/[a-z]/);
  }

  /*Returns true if input character is a letter or a digit*/
  this.isLetterOrDigit = function(c){
    return this.isDigit(c) || this.isLetter(c);
  }

  /*Returns true if input character is an identifier*/
  this.isIdentifier = function(c){
    return this.isLetterOrDigit(c) || c=='_';
  }

  /*Returns the next character from the file being lexed*/
  this.consume = function(){
    currentChar = inputStream.read(1);
  }

  /*Skip all junk characters when reading in input file*/
  this.eatLayout = function(){
    while(currentChar != null && (isNaN(currentChar.charCodeAt(0)) || currentChar.charCodeAt(0) <= 32)){
      this.consume();
    }
  }
  /*The main function, gets the next available token from the file*/
  this.getNextToken = function(){
    this.eatLayout();

    //Done reading the file
    if (currentChar == null){
      running = false;
      return;
    //Depending on the character decide what to do next
    }else if (this.isLetter(currentChar)){
      this.recognizeIdentifier();
    }else if (this.isDigit(currentChar)){
      this.recognizeDigit();
    }else{
      switch(currentChar){
        case '-': case '+': case '/': case '*':
        case '=': case '(': case ')': case '[':
        case ']': case ',': case '{': case '}':
        case ';': case '.':
          this.recognize_symbol();
          break;
        case '\'':
          this.recognizeCharacter();
          break;
        case '\"':
          this.recoginizeString();
          break;
        default:
          console.log('unrecognized character', currentCharacter);
          break;
      }
    }
  }
  //Will keep reading until an identifier is not possible
  this.recognizeIdentifier = function() {
    while (this.isIdentifier(currentChar)){
      currLexeme.push(currentChar);
      this.consume();
    }
    var file = path.resolve(inputStream.path); //Path to file that is being read from
    var nextToken = new Token(file, currLexeme.join(''), 'IDENTIFIER');
    tokens.push(nextToken); //Keeping track of our tokens
    currLexeme=[]; //Reset lexeme to prepare for next call to getToken;
    return;
  }

  //Will keep reading until a number is not possible
  this.recognizeDigit = function(){
    //Keep recognizing numbers while they're streaming in
    while (this.isDigit(currentChar)){
      currLexeme.push(currentChar);
      this.consume();
    }
    //If a . is the next character then the number should be a decimal
    if (currentChar == '.') {
      currLexeme.push(currentChar);

      while (this.isDigit(currentChar)){
        currLexeme.push(currentChar);
        this.consume();
      }
    }
    //Repeated code, make DRY later...
    var file = path.resolve(inputStream.path); //Path to file that is being read from
    var nextToken = new Token(file, currLexeme.join(''), 'NUMBER');
    tokens.push(nextToken); //Keeping track of our tokens
    currLexeme=[]; //Reset lexeme to prepare for next call to getToken;
  }
}

module.exports = Lexer;
