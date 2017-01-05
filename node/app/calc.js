// app/calc.js

function summa (arr) {  
  return arr.reduce(function(a, b) { 
    return a + b
  }, 0)
}

module.exports.sum = summa  