
const port = 3000;

const lajiAPI = require('./lajiapi.js');
const http = require('http');

// Functions
const startServer = function startServer(err) {  
  if (err) {
    return console.log('Something went wrong.', err);
  }
  console.log(`Server is listening on port ${port}`);
}

const requestHandler = function requestHandler(request, response) {
  if ("GET" != request.method) {
    response.statusCode = 404;
  }
  else {
//    response.end('Handling data...');
    lajiAPI.handleQuery(request, response);
  }

//  logToConsole(request);
}

/*
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
*/

/*
createServer is designed to call callbeack function defined in the variable "requestHandler"
by givingh it two arguments, request and reponse objects. This is the standard way of using 
callback functions.
*/

const server = http.createServer(requestHandler); 
server.listen(port, startServer);


// ---------------------------------------------------------------
/*

http.get('http://nodejs.org/dist/index.json', (res) => {


*/

