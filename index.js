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
  var detP = Math.round(P.determinant());

  // check here if should perform calcs
  // if should, do
  // if shouldn't display warning message
  if(detP == 0){
    $("#det").text(" [determinant cannot be zero] ");
  }else{
    $("#det").text("" + detP);
    if ((P.rows() === P.cols())){
      var eigens = mHelp.eigenvalues(P.rows(), detP, 1)
      setEigenvalues(eigens);
      var diag = mHelp.diagonal(eigens);
      setMatrix(mHelp.roundedProduct(P, diag, detP));
      setCharPoly(eigens);
    }
  }
}

setMatrix = function(matrix){
  html = '';
  // indexes into array begin at 1
  for(var i = 1; i <= matrix.rows(); i++){
    for(var j = 1; j <= matrix.cols(); j++){
      html += matrix.e(i,j)
      if (j - matrix.cols()) { html += " , " }
    }
    html += "<br/>"
  }
  $("#final-matrix").html(html);
}

setCharPoly = function(eigens){
  poly = mHelp.charPoly(eigens);
  $("#charPoly span").html(poly);
}

setEigenvalues = function(lambdas){
  eigens = cleanArray(lambdas);
  numEls = $("#eigens").children().length;
  numEigens = eigens.length;
  if (numEls > numEigens){
    for (var i = numEigens; i < numEls; i++){
      $("#eigen" + i).parent().remove();
    }
  } else if (numEls < numEigens){
    for(var i = numEls; i < numEigens; i++){
      $("#eigens").append(
        "<div class='row'>&lambda;<sub>" + i + "</sub> = <span id='eigen"+i+"'>"
        + eigens[i]+"</span>" + button("up") + button("down") +"</div>")
    }
  }
  for(var i = 0; i < eigens.length; i++){
    $("#eigen" + i).html("  " + eigens[i]);
  }
}

cleanArray = function(arr){
  newArr = [];
  for(var i = 0; i < arr.length; i++){
    if(!isNaN(arr[i])){
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

button = function(type){
  return "<button type='button' class='btn btn-default'><span class='glyphicon glyphicon-" + type + "load'></span></button>"
}