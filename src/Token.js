/*
 * This file contains the Token module where Token
 * is an object that represents a token from the
 * input source code file
 *
 */

function Token(sourceFile, lexeme, type){
  var sourceFile = sourceFile;
  var lexeme = lexeme;
  var type = type;

  this.getContents = function(){
    return lexeme;
  }

  this.getType = function(){
    return type;
  }

  this.getSource = function(){
    return sourceFile;
  }
}

module.exports = Token;
