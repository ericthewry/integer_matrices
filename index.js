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
        var P = mHelp.matrixFromString(string);
        var detP = P.determinant();
        $("#det").text("" + detP);
        eigens = mHelp.eigenvalues(P.rows(), detP, 1)
        console.log(eigens);
        setEigenvalues(eigens);
      }
    )
  }
)


setEigenvalues = function(eigens){
  for(var i = 0; i < eigens.length; i++){
    console.log("#eigen" + i + " -> " + eigens[i]);
    $("#eigen" + i).html("  " + eigens[i]);
  }
}