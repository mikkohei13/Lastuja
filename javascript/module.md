## JavaScript patterns

# Module pattern

https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript

Allows having public and private variables and methods inside an objects, encapsulated by closure. Reduces likelihood for name collisions. Only a public API is returned.

## Main app

// Increment counter and log

        moduleName.publicFunction();
 
        console.log("Returned " moduleName.publicVar);


## Module file

var moduleName = (function () {
  
  let privateVar = 0;
 
  let privateMethod = function(privateParam) {
      console.log("Logged " + privateParam);
  };
 
  return {
 
    publicVar: privateVar,
 
    publicFunction: function(publicParam) {
 
      privateVar++;

      privateMethod(publicParam);
    }
  };
 
})();
