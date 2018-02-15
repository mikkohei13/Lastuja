const gpxParse = require('gpx-parse')


function parser() {
  gpxParse.parseGpxFromFile("./mytracks01.gpx", function(error, data) {
    let waypoints = data.waypoints
    let parsedWaypoints = waypoints.map(waypoint => {
      return waypoint.name;
    })
    console.log(parsedWaypoints) 
  });
  return "Parsing going on..."
}

module.exports = {
  "parser" : parser
};