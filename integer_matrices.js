var $ = require("sylvester")

PRECISION = 5
RESIDUE = 7

exports.determinant = function(matrix){
  return matrix.determinant();
}

exports.matrixFromString = function(input){
  return exports.matrixFromArray(exports.arrayFromString(input));
}

exports.matrixFromArray = function(arr){
  size = Math.sqrt(arr.length);
  trix = []
  for(var row = 0; row < size ; row++){
    trix.push([]);
    for(var col = 0; col < size; col++){
      trix[row].push(parseInt(arr[row*size + col]));
    }
  }
  return $M(trix);
}

exports.eigenvalues = function(size, determinant, residue, coeffs){
  eigenvalues = [];
  for(var i = 0; i < size ; i++){
    if (i >= coeffs.length){
      coeffs.push(coeffs[i-1] + 1)
    }
    eigenvalues.push(residue + coeffs[i]*determinant)
  }
  return eigenvalues;
}

exports.diagonal = function(eigenvalues){
  return $.Matrix.Diagonal(eigenvalues);
}

exports.roundedProduct = function (P, D, det){
  cofactorMatrix = P.inv().x(det)
  return P.x(D).x(cofactorMatrix).x(1/det).round();
}

exports.arrayFromString = function (strArr){
  var array = []
  var numRows = 0

  array = strArr.match(/-?\d+/g)
  return array
}

exports.charPoly = function (eigens){
  var poly = "";
  coeffs = [];

  if (eigens.length === 1){
    return toPoly(eigens[0]);
  } else if (eigens.length === 2){
    coeffs = [1, -(eigens[0] + eigens[1]), (eigens[0]*eigens[1])]
  } else if (eigens.length === 3){
    coeffs = [1, -(eigens[0] + eigens[1] + eigens[2]), (eigens[0]*eigens[1] + eigens[1]*eigens[2] + eigens[0]*eigens[2]), -(eigens[0]*eigens[1]*eigens[2])]
    console.log(coeffs);
  } else {
    for(var i = 0; i < eigens.length; i++){
      poly += toFactor(eigens[i]);
    }
    return poly;
  }
  for (var i = coeffs.length-1; i >= 0; i--){
    poly += toTerm(i, coeffs)
  }
  return poly;
}

toTerm = function(exp, coeffs){
  len = coeffs.length - 1;
  c = ""
  if (coeffs[len - exp] != 1){
     c = coeffs[len - exp]
  }
  if (exp === 0){
     return (c + "");
  } else if (exp === 1){
     return (c + "x + ");
  } else {
    return (c + "x<sup>" + exp + "</sup> + ");
  }
}

toFactor = function (lam){
  if (lam < 0){
    return "(x+ " + (-lam) + ")";
  } else {
    return "(x - " + lam + ")";
  }
}

// polynomials are ordered by coefficients of decreasing degree
// polyB is assumed to be a binomial of the form (x + b)
exports.polyMult = function (polyA, polyB){
  lengthA = polyA.length;

  // multiply by the x term
  timesX = polyA.slice();
  timesX.push(0);

  // make them the same length
  timesConst = polyA.slice();
  timesConst.unshift(0);

  // multiply by the constant (b)
  for(var i = 0; i < lengthA; i++){
    timesConst[i+1] *= polyB[1];
  }

  // add the polynomials
  return addTwoArrays(timesX, timesConst);
}

exports.stringToPoly = function (str){
  return str.replace(/\bx/g, "1x").replace(/x[\^\d]*/g,"").match(/-?\s*\d/g).map(removeWhitespace).map(Number)
}

polyToString = function(poly){
  str = "";
  for (var i = poly.length - 1; i > 0 ; i--){
    if (poly[i] != 1){
      str += poly[i]
    }
    str += "x<sup>" + i + "</sup> + "
  }
  str += poly[0];
  return str.replace(/\+\s-/g, "- ");
}

// Add two integer arrays of the same length
// otherwise return an empty array
addTwoArrays = function(arr1, arr2){
  sum = [];
  if (arr1.length == arr2.length){
    for (var i = 0; i < arr1.length; i++){
      sum.push(arr1[i] + arr2[i]);
    }
  }
  return sum;
}

removeWhitespace = function (str) {
  return str.replace(/\s+/g, "")
}
