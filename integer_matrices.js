var $ = require("sylvester")

PRECISION = 5
RESIDUE = 7

  // P = $M(arrayFromString(result.matrix))

  // Generate eigenvalues
  // var k = Math.abs(P.determinant())

  // if (k === 0){
    // fix the matrix so its not diagonalizable
    // console.log("ERROR: Determinant of Matrix cannot be Zero")
  // } else {
    // var N = P.cols()
    // var message = "\nYou have chosen "
    // var eigenvalues = []

    // for(var i = -1; i < N-1; i++){
      // if(i < 0){
        // message += "(" + RESIDUE + " - " + (k) +"), "
      // } else if (i === 0) {
        // message += "(" + RESIDUE + ")"
//       } else {
//         message += ", (" + RESIDUE + " + " + (i*k) + ")"
//       }

//       eigenvalues.push(RESIDUE+i*k)
//     }

//     console.log(message)

//     // create D
//     var D = $.Matrix.Diagonal(eigenvalues)

//     console.log("\nThe diagonalized matrix: \n" + (D.inspect()))

//     // create A = PD(P^-1)
//     var A = P.x(D).x(P.inv().x(k).round()).x(1/k)
//     console.log("\n The final matrix is \n" + A.inspect()  )
//     console.log("\n Its characteristic polynomial is \n\t" + charPoly(A, eigenvalues))
//   }
// })

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

exports.eigenvalues = function(size, determinant, residue){
  eigenvalues = [];
  for(var i = -1; i < size-1 ; i++){
    eigenvalues.push(residue + i*determinant)
  }
  return eigenvalues;
}

exports.diagonal = function(eigenvalues){
  return $.Matrix.Diagonal(eigenvalues);
}

exports.roundedProduct = function (P, D, det){
  cofactorMatrix = P.inv().x(det)
  return P.x(D).x(cofactorMatrix).x(1/det)
}

exports.arrayFromString = function (strArr){
  var array = []
  var numRows = 0

  array = strArr.match(/\d+/g)
  return array
}

exports.charPoly = function (matrix, eVals){
  var poly = "";
  for(var i = 0; i < eVals.length; i++){
    var lam = eVals[i]
    if (lam < 0){
      poly += "(x+ " + (-lam) + ")"
    } else {
      poly += "(x - " + lam + ")"
    }
  }
  return poly
}