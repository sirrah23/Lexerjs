/*
 *  This is the module that will return an file reader
 *  stream and return it...
 *
 */

var fs = require('fs');

function readFile(inputFile){
  var fileStream = fs.createReadStream(inputFile,{
    encoding: 'utf8',
    fd: null,
  });
  return fileStream;
}

module.exports = readFile;
