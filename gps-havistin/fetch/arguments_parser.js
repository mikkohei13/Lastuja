
// -----------------------------------------------------------
// Public functions

function allowedArguments() {

  // Add allowed args here. If arg is found, dashes will be removed and arg is set to true
  const allowedArgs = ["--emailResponse", "--test"];

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
