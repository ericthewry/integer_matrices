window.jQuery = window.$ =  require('jquery');
var bs = require('bootstrap-webpack');

console.log('hello world');

$(document).ready(
  function(){
    console.log("page loaded");
    $("#input-matrix").bind('input',
      function(){
        console.log($(this).text())
      }
    )
  }
)