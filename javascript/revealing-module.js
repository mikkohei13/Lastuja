/*
## JavaScript patterns

# Revealing module pattern

https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript

Like module pattern, but allows simpler refferinng to module methods and variables. 

## Module file
*/

var loggerModule = (function () {
  
  let privateVar = 0;
 
  let privateLog = function(privateParam) {
      console.log("Added " + privateParam + ", so the private counter variable is now " + privateVar);
  };

  let publicVar = "This is public string"

  function addInt(publicVar) {
    privateVar = privateVar + publicVar;
    privateLog(publicVar);
  }
 
  return {
    publicVar: publicVar,
    addInt: addInt
  };
 
})();

/*
## Main app
*/

loggerModule.addInt(5);
loggerModule.addInt(1);

console.log("Retuned string: " + loggerModule.publicVar);

//console.log("Returned " loggerModule.publicVar);
