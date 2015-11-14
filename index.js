window.jQuery = window.$ =  require('jquery');
var bs = require('bootstrap-webpack');
var mHelp = require('./integer_matrices');

console.log('hello world');

$(document).ready(
  function(){
    console.log("page loaded");
    $("#input-matrix").bind('input',
      function(){
        console.log('input');
        var string = $(this).text();
        console.log(mHelp.arrayFromString(string));
        var P = mHelp.matrixFromString(string)
        console.log(P.inspect());
      }
    )
  }
)