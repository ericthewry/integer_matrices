window.jQuery = window.$ =  require('jquery');
var bs = require('bootstrap-webpack');
var imies = require('./integer_matrices');

var residue = 1;
var matrixID = "#input-matrix";
var DEFAULT_COEFFS = [0, -1, 1, -2, 2, -3, 3];
var eigenCoeffs = DEFAULT_COEFFS.slice();
var matrixSelector = 0

$(document).ready(
  function(){
    bindReset();
    bindToggle();
    runIMIES(matrixID);
    $(matrixID).bind('input', function(){ runIMIES(this) });
  }
)

runIMIES = function(matrix){
  var string = $(matrix).text();
  var P = imies.matrixFromString(string);
  var detP = Math.round(P.determinant());

  if(detP == 0){
    $("#det").text(" [determinant cannot be zero] ");
  }else{
    $("#det").text("" + detP);
    if ((P.rows() === P.cols())){
      var eigens = imies.eigenvalues(P.rows(), detP, residue, eigenCoeffs)
      setEigenvalues(eigens, detP);

      //  imies.make returns the matrix and the string name of the matrix
      //  i.e. imie === [matrix, name]
      imie = imies.make(P, eigens, detP, matrixSelector)

      setMatrix(imie[0], imie[1]);
      setCharPoly(eigens);
    }
  }
}

setMatrix = function(matrix, name){
  html = ''
  // indexes into array begin at 1
  for(var i = 1; i <= matrix.rows(); i++){
    for(var j = 1; j <= matrix.cols(); j++){
      html += matrix.e(i,j)
      if (j - matrix.cols()) { html += " , " }
    }
    html += "<br/>"
  }
  $("#final-matrix").html(html);
  $("#mname").html(name);
}

setCharPoly = function(eigens){
  poly = imies.charPoly(eigens);
  $("#charPoly span").html(poly);
}

setEigenvalues = function(lambdas, det){
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
        "<div class='row'>&lambda;<sub>" + (i+1) + "</sub> = <span id='eigen"+i+"'>"
        + eigens[i]+"</span>" + button("up", i) + button("down", i) +"</div>");
    }
  }
  for(var i = 0; i < eigens.length; i++){
    $("#eigen" + i).html("  " + eigens[i]);
    bindButton(i, det);
  }
  if (imies.eigensAreUnique(eigens)){
    $("#toggle-button").hide()
  } else {
    $("#toggle-button").show()
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

button = function(type, i){
  return "<button id='eigenbutton"+i+"-"+type+"' type='button' class='glyph-btn btn btn-default'>"+
    "<span class='glyphicon glyphicon-white glyphicon-" + type + "load'></span>"
    +"</button>"
}

bindButton = function(idx, det){
  $("#eigenbutton"+idx+"-up").unbind('click');
  $("#eigenbutton"+idx+"-down").unbind('click');
  if(idx === 0){
    $("#eigenbutton0-up").click(function(){
      residue++;
      runIMIES(matrixID);
    });
    $("#eigenbutton0-down").click(function(){
      residue--;
      runIMIES(matrixID);
    });
  } else {
    $("#eigenbutton"+idx+"-up").click(function(){
      det < 0 ? eigenCoeffs[idx]-- : eigenCoeffs[idx]++ ;
      runIMIES(matrixID);
    });
    $("#eigenbutton"+idx+"-down").click(function(){
      det < 0 ? eigenCoeffs[idx]++ : eigenCoeffs[idx]-- ;
      runIMIES(matrixID);
    });
  }
}

bindReset = function(){
  $("#reset-button").click(
    function(){
      eigenCoeffs = DEFAULT_COEFFS.slice();
      residue = 1;
      runIMIES(matrixID);
    }
  )
}

bindToggle = function(){
  $("#toggle-button").click(
    function(){
      matrixSelector += 1;
      runIMIES(matrixID);
    }
  )
}