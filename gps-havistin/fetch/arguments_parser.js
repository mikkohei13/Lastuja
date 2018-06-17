/*
Adds allowed command-line arguments into an object, with dashes removed, e.g. { argument: true }
*/
// -----------------------------------------------------------
// Public functions

function allowedArguments() {

  // Add allowed args here
  const allowedArgs = ["--emailResponse", "--emailLog", "--test"];

  let ret = {};

  process.argv.forEach(function(singleArg) {
    if (allowedArgs.includes(singleArg)) {
      const singleArgWithoutDashes = singleArg.replace("--", "");
      ret[singleArgWithoutDashes] = true;
    }
  });
  
  return ret;
}

module.exports = {
  allowedArguments,
};
