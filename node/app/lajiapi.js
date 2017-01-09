// lajiapi module
const url = require('url');
//const http = require('http');
const https = require('https');
const keys = require('../keys.js');

let response;

// Decides what to do with the query
function handleQuery(serverRequest, serverResponse) {
  response = serverResponse; // Make this available to the whole module

  // Don't handle favicon requests
  if ('/favicon.ico' != serverRequest.url) {
    console.log(keys.lajiToken);

    if ("/uploads" == serverRequest.url) {
      console.log("/uploads");
    }
    else if ("/latest" == serverRequest.url) {

      let options = {
        host: 'api.laji.fi',
        path: '/v0/warehouse/query/aggregate?aggregateBy=document.collectionId&geoJSON=false&pageSize=100&page=1&loadedLaterThan=2017-01-06&access_token=' + keys.lajiToken
	  };

	  https.get(options, handleAPIResponseStream).on('error', handleAPIError);
    }
    else {
    	console.log("unknown URL (404)");
    }
  }
}

// Gets data from api.laji.fi and formats it
function handleAPIResponseStream(apiResponse) {
	let body = '';

    apiResponse.on('data', function(chunk) {
        body += chunk;
    });

    apiResponse.on('end', function() {
    	sendToBrowser(body);
    });
}

function handleAPIError(error) {
	console.log("Error reading API (check your internet connection): " + error);
	response.end('Error reading API: ' + error);
}

module.exports = {
	handleQuery : handleQuery
};

function sendToBrowser(body) {
	console.log(body);

	// Data reception is done, do whatever with it!
	let parsedBody = JSON.parse(body);

	response.end(body);
}


