// lajiapi module
const url = require('url');

function handleQuery(request) {
  // Don't handle favicon requests
  if ('/favicon.ico' != request.url) {
    let urlObject = url.parse(request.url);
    console.log(urlObject);

    if ("/uploads" == request.url) {
      console.log("/uploads");
    }
    else if ("/latest" == request.url) {
      console.log("/latest");
    }
    else {
    	console.log("unknown!");
    }
  }
}

module.exports = {
	handleQuery : handleQuery
};


