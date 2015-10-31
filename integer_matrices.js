var $ = require("sylvester")
var prompt = require("prompt")

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
    console.log("\nYou have chosen 1 - " + k + ", 1, and 1 + " + k + " as your eigenvalues")

    eigenvalues = [1-k, 1, 1+k]

    // create D
    var D = $.Matrix.Diagonal(eigenvalues)

    console.log("\nThe diagonalized matrix: \n" + (D.inspect()))

    // create A
    var A = P.x(D).x(P.inv())
    console.log("\n The characteristic polynomial is \n\t" + charPoly(A, eigenvalues))
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
      poly += "(&Lambda + " + (-lam) + ")"
    } else {
      poly += "(&Lambda - " + lam + ")"
    }
  }
  return poly
}

function onErr(err){
  console.log(err)
  return 1
}

