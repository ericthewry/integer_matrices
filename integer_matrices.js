var $ = require("sylvester")

var P = $M([
  [1,7,3],
  [9,4,0],
  [2,7,1]
])

// Generate eigenvalues
console.log(P)
var k = P.determinant()
var N = P.cols()
console.log("You have chosen 1 - " + k + ", 1, and 1 + " + k + " as your eigenvalues")

eigenvalues = [1-k, 1, 1+k]

// create D
var D = $.Matrix.Diagonal(eigenvalues)

// create A
var A = P.x(D).x(P.inv())

function charPoly(matrix, eVals){
  var poly = "";
  for(var i = 0; i < eVals.length; i++){
    var lam = eVals[i]
    poly += "(&Lambda - " + lam + ")"
  }
  return poly
}

console.log(charPoly(A, eigenvalues))
