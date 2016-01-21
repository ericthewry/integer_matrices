var $ = require("./sylvester/lib/sylvester")

PRECISION = 5
RESIDUE = 7

exports.determinant = function(matrix){
  return matrix.determinant();
}

exports.matrixFromString = function(input){
  return exports.matrixFromArray(exports.arrayFromString(input));
}

exports.makeNilpotent = function(eigens, det){
  // create a zeroed matrix
  var nilpot = $.Matrix.Zero(eigens.length, eigens.length);
  // if there's a duplicate eigenvalue, set the determinant
  // at that intersection
  for(var i = 1; i <= eigens.length; i++){
    for( var j = i + 1; j <= eigens.length; j++){
      if(eigens[i-1] === eigens[j-1]){
        els = nilpot.elements
        els[i][j] = det
        nilpot.setElements(els)
      }
    }
  }
  return nilpot
}

exports.make = function(P, eigens, k, count){
  // If there are no duplicates
  if (exports.eigensAreUnique(eigens)){
    return [exports.mainMatrix(P, eigens, k), "PDP<sup>-1</sup> = A ="];
  }
  if (count % 3 === 0){
    return [exports.mainMatrix(P, eigens, k), "PDP<sup>-1</sup> = A ="];
  } else if (count % 3 === 1){
    return [exports.nilpotOffset(P, eigens, k), "PDP<sup>-1</sup> + PNP<sup>-1</sup> = B"];
  } else {
    return [exports.nilpotTransposeOffset(P, eigens, k), "PDP<sup>-1</sup> + PN<sup>t</sup>P<sup>-1</sup> = B\'"];
  }
}

exports.eigensAreUnique = function(eigens){
  return (new Set(eigens)).size === eigens.length
}

exports.mainMatrix = function(P, eigens, k){
  var diag = exports.diagonal(eigens);
  return exports.roundedProduct(P, diag, k);
}

exports.nilpotOffset = function(P, eigens, k){
  var N = exports.makeNilpotent(eigens, k);
  var A = exports.mainMatrix(P, eigens, k);
  var PNPinv = exports.roundedProduct(P, N, k);
  return A.add(PNPinv);
}

exports.nilpotTransposeOffset = function(P, eigens, k){
  var A =  exports.mainMatrix(P,eigens,k);
  var Nt = exports.makeNilpotent(eigens, k).transpose();
  return A.add(exports.roundedProduct(P, Nt, k))
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
  return $.Matrix.create(trix);
}

exports.eigenvalues = function(size, determinant, residue, coeffs){
  eigenvalues = [];
  for(var i = 0; i < size ; i++){
    if (i >= coeffs.length){
      // use formula to generate ith coefficient
      coeffs.push(coeffs[i-2] - 1)
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

  return polyToString(expandFactors(eigensToPolyArr(eigens), []));
}

expandFactors = function expand (factorized, soFar){
  if (factorized.length === 0){
    return soFar;
  } else {
    factor = factorized.pop()
    if(soFar.length === 0){
      return expand(factorized, factor);
    }else{
      return expand(factorized, polyMult(soFar, factor));
    }
  }
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
polyMult = function (polyA, polyB){
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

stringToPoly = function (str){
  return str.replace(/\bx/g, "1x").replace(/x[\^\d+]*/g,"").match(/-?\s*\d+/g).map(removeWhitespace).map(Number)
}

eigensToPolyArr = function (eigens){
  polys = []
  for(var e = 0; e < eigens.length; e++){
    polys.push([1, -eigens[e]]);
  }
  return polys;
}

polyToString = function(poly){
  str = "";
  len = poly.length - 1;
  for (var i = len; i > 0 ; i--){
    if (poly[len-i] != 0){
      if (poly[len-i] != 1){ str += poly[len-i] }
      str += "x"
      if (i != 1){ str += "<sup>" + i + "</sup> " }
    }
    if(poly[len-i+1] != 0 && !(len-i === 0 && poly[len-i] === 0) ){
      str +=" + "
    }
  }
  if (poly[len] != 0){ str += poly[len] }
  return str.replace(/\+\s-/g, "- ").replace(/1x/g, "x");
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
