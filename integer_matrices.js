var $ = require("sylvester")
var prompt = require("prompt")

PRECISION = 5
RESIDUE = 7

prompt.start()

prompt.get(['matrix'], function(err, result){
  if (err) { return onErr(err) }

  P = $M(arrayFromString(result.matrix))

  console.log("You input the matrix: \n" + P.inspect())

  // Generate eigenvalues
  var k = Math.abs(P.determinant())

  if (k === 0){
    // fix the matrix so its not diagonalizable
    console.log("ERROR: Determinant of Matrix cannot be Zero")
  } else {
    var N = P.cols()
    var message = "\nYou have chosen "
    var eigenvalues = []

    for(var i = -1; i < N-1; i++){
      if(i < 0){
        message += "(" + RESIDUE + " - " + (k) +"), "
      } else if (i === 0) {
        message += "(" + RESIDUE + ")"
      } else {
        message += ", (" + RESIDUE + " + " + (i*k) + ")"
      }

      eigenvalues.push(RESIDUE+i*k)
    }

    console.log(message)

    // create D
    var D = $.Matrix.Diagonal(eigenvalues)

    console.log("\nThe diagonalized matrix: \n" + (D.inspect()))

    // create A = PD(P^-1)
    var A = P.x(D).x(P.inv().x(k).round()).x(1/k)
    console.log("\n The final matrix is \n" + A.inspect()  )
    console.log("\n Its characteristic polynomial is \n\t" + charPoly(A, eigenvalues))
  }
})

function arrayFromString(strArr){
  var array = []
  var numRows = 0

  var i = 0;

  while(i < strArr.length){

    // console.log("i: " + i + "("+strArr[i]+")")

    if (strArr[i] == "["){
      array.push([])

      var j = i+1;

      while(strArr[j] != "]"){
        // console.log("j: " + j + "("+strArr[j]+")")

        if(strArr[j] != ',' && strArr[j] != "[" && strArr[j] != "]"){
          // console.log("push " + strArr[j])
          array[numRows].push(parseInt(strArr[j]))
        }
        j++
      }
      numRows++
      i = j
      continue
    }
    i++
  }

  return array
}

function charPoly(matrix, eVals){
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

function onErr(err){
  console.log(err)
  return 1
}


function roundMatrix(m){
  var dims = m.dimensions()
  var rows = dims["rows"]
  var cols = dims ["cols"]

  M = []

  for(var i = 0; i < rows; i++){
    M.push([])
    for(var j = 0; j < cols; j++){

      M[i].push(roundToPrecision(m.e(i,j), PRECISION))
    }
  }
  return $M.create(M);
}

function roundToPrecision(x, p){
  console.log("rounding "+ x)
  return parseFloat(x.toFixed(p));
}

function product(mxs){
  prod = mxs[0]
  for(var i = 1; i < mxs.length; i++){
    prod.x(mxs[i])
  }
}