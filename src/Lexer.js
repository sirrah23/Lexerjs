/*
 *  This file contains a Lexer module. A Lexer
 *  object is created that reads a file on loop
 *  and returns an array of tokens for that file.
 *
 */
var Token = require('./Token.js');

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
    return !isNaN(c);
  }

  /*Returns true if input character is a letter*/
  this.isLetter = function(c){
    return c.match(/[a-z]/);
  }

  /*Returns true if input character is a letter or a digit*/
  this.isLetterOrDigit = function(c){
    return isDigit(c) || isLetter(c);
  }

  /*Returns true if input character is an identifier*/
  this.isIdentifier = function(c){
    return isLetterOrDigit(c) || c=='_';
  }

  /*Returns the next character from the file being lexed*/
  this.consume = function(){
    currentChar = inputStream.read(1);
  }
 
  /*Skip all junk characters when reading in input file*/
  this.eatLayout = function(){
    while(currentChar != null && currentChar.charCodeAt(0) != NaN && currentChar.charCodeAt(0) <= 32){
      consume();
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
    }else if (isLetter(currentCharacter)){
      recognizeIdentifier();
    }else if (isDigit(currentCharacter)){
      recognizeDigit();
    }else{
      switch(currentCharacter){
        case '-': case '+': case '/': case '*':
        case '=': case '(': case ')': case '[':
        case ']': case ',': case '{': case '}':
        case ';': case '.':
          recognize_symbol();
          break;            
        case '\'':
          recognizeCharacter();
          break;
        case '\"':
          recoginizeString();
          break;
        default:
          console.log('unrecognized character', currentCharacter);
          break;
      } 
    }
  }
}

module.exports = Lexer;
