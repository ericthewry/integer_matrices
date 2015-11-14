window.jQuery = window.$ =  require('jquery');
var bs = require('bootstrap-webpack');
var mHelp = require('./integer_matrices');

console.log('hello world');

$(document).ready(
  function(){
    console.log("page loaded");
    runIMIES("#input-matrix");
    $("#input-matrix").bind('input', function(){ runIMIES(this) });
  }
)

runIMIES = function(matrix){
  var string = $(matrix).text();
  var P = mHelp.matrixFromString(string);
  var detP = P.determinant();
  $("#det").text("" + detP);
  var eigens = mHelp.eigenvalues(P.rows(), detP, 1)
  setEigenvalues(eigens);
  var diag = mHelp.diagonal(eigens);
  setMatrix(mHelp.roundedProduct(P, diag, detP));
}

setMatrix = function(matrix){
  html = '';
  console.log(matrix);
  // indexes into array begin at 1
  for(var i = 1; i <= matrix.rows(); i++){
    for(var j = 1; j <= matrix.cols(); j++){
      html += matrix.e(i,j)
      if (j - matrix.cols()) { html += " , " }
    }
    html += "<br/>"
  }
  console.log(html);
  $("#final-matrix").html(html);
}

setEigenvalues = function(eigens){
  for(var i = 0; i < eigens.length; i++){
    console.log("#eigen" + i + " -> " + eigens[i]);
    $("#eigen" + i).html("  " + eigens[i]);
  }
}