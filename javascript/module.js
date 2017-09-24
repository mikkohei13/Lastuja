/*
## JavaScript patterns

# Module pattern

https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript

Allows having public and private variables and methods inside an objects, encapsulated by closure. As the module is non reloaded after init, it maintaiunst it's state. Reduces likelihood for name collisions. Only a public API is returned.

## Module file
*/

var loggerModule = (function () {
  
  let privateVar = 0;
 
  let privateLog = function(privateParam) {
      console.log("Added " + privateParam + ", so the private counter variable is now " + privateVar);
  };
 
  return {
 
    publicVar: "This is public string",
 
    addInt: function(publicVar) {
        privateVar = privateVar + publicVar;
        privateLog(publicVar);
    }
  };
 
})();

/*
## Main app
*/

loggerModule.addInt(5);
loggerModule.addInt(1);

console.log("Retuned string: " + loggerModule.publicVar);

//console.log("Returned " loggerModule.publicVar);
