
const lajiAPI = require('./lajiapi.js');

// Options
const http = require('http');  
const port = 3000;

// Functions
const requestListener = function listener(request, response) {
  logToConsole(request);

  response.end('Hoi Node.js Server!');
}

function logToConsole(request) {
  if ("/favicon.ico" == request.url)
  {

  }
  else
  {
    console.log(request.url);
  //  console.log(request.headers);

    let json = lajiAPI.importantVariable;
    console.log(json);
  }
}




// createServer is designed to call callbeack function defined in the variable "requestListener" by givingh it two arguments, request and reponse objects. This is the standard way of use callback functions.
const server = http.createServer(requestListener); 

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});





// ---------------------------------------------------------------
/*

http.get('http://nodejs.org/dist/index.json', (res) => {


*/

