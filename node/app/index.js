
const port = 3000;

const lajiAPI = require('./lajiapi.js');
const http = require('http');
const url = require('url');

// Functions
const startServer = function startServer(err) {  
  if (err) {
    return console.log('Something went wrong.', err);
  }
  console.log(`Server is listening on port ${port}`);
}

const requestListener = function requestListener(request, response) {
  response.end('Hoi Node.js Server!');
  logToConsole(request);
}

function logToConsole(request) {
  // Don't handle favicon requests
  if ('/favicon.ico' != request.url)
  {
    let urlObject = url.parse(request.url);
    console.log(urlObject);

    if ("uploads" == request.url)
    {
      let json = lajiAPI.importantVariable;
    }
  }
}

/*
createServer is designed to call callbeack function defined in the variable "requestListener"
by givingh it two arguments, request and reponse objects. This is the standard way of using 
callback functions.
*/

const server = http.createServer(requestListener); 
server.listen(port, startServer);


// ---------------------------------------------------------------
/*

http.get('http://nodejs.org/dist/index.json', (res) => {


*/

