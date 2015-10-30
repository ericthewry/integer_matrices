
function determinant(matrixP){
  fixRow = 0
  det = 0

  /*if (matrixP.length = 2){
    console.log("base case 2 : " + matrixP)
    return twoSquareDet(matrixP)
  } else*/
  if (matrixP.length = 1) {
    console.log("base case 1: " + matrixP)
    return matrixP[fixRow][0]
  }


  console.log(matrixP)

  for (var i = 0 ; i < matrixP.length ; i++){
    cofactor = sign(i, fixRow) + determinant(minor(matrixP, i, fixRow))
    pCurr = matrixP[fixRow][i]
    console.log("cofactor : " + cofactor)
    console.log("a_{ij} : " + pCurr)
    det += pCurr * cofactor
  }
  return det
}

function sign(i,j){
  return Math.pow(-1, i+j)
}

function minor(matrix, skipCol, skipRow){
  cfm = []
  for (var row = 0; row < matrix.length; row++){
    if (row === skipRow){
      continue
    } else{
      cfm.push([])
      for (var col = 0; col < matrix[row].length; col++){
        if (col === skipCol){
          continue
        }else if (row > skipRow){
          cfm[row-1].push(matrix[row][col])
        } else{
          cfm[row].push(matrix[row][col])
        }
      }
    }
  }
  return cfm
}

function twoSquareDet(matrix){
  if (matrix.length = 2){
    return matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0]
  } else {
    return NaN
  }
}

M = [
      [1,2,3],
      [2,3,5],
      [3,6,1]
    ]
m = [
      [1,3],
      [5,4]
    ]

console.log(M)
console.log(determinant(M))

console.log(minor(m, 0, 0))
console.log(minor(m, 0, 1))

console.log(twoSquareDet(m))
console.log(determinant(m))
