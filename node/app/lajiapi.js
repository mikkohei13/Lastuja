// lajiapi module
const url = require('url');
//const http = require('http');
const https = require('https');
const keys = require('../keys.js');

function handleQuery(request) {
  // Don't handle favicon requests
  if ('/favicon.ico' != request.url) {
//    let urlObject = url.parse(request.url);
//    console.log(request.url);
    console.log(keys.lajiToken);

    if ("/uploads" == request.url) {
      console.log("/uploads");
    }
    else if ("/latest" == request.url) {

      let options = {
        host: 'api.laji.fi',
        path: '/v0/warehouse/query/aggregate?aggregateBy=document.collectionId&geoJSON=false&pageSize=100&page=1&loadedLaterThan=2017-01-06&access_token=' + keys.lajiToken
	  };

	  https.get(options, function(response) {
		let body = '';

        response.on('data', function(chunk) {
            body += chunk;
        });

        response.on('end', function() {
            // Data reception is done, do whatever with it!
            let parsed = JSON.parse(body);

            console.log("--- Latest parsed: ---");
            console.log(parsed);
        });

   	  });
    }
    else {
    	console.log("unknown URL (404)");
    }
  }
}

function uploads() {

}

module.exports = {
	handleQuery : handleQuery
};


