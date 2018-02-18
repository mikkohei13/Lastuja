const gpxParse = require('gpx-parse')
let baseDocumentParts = require('./baseDocumentParts')
const util = require('util')

// Returns an array of waypoints
function parseWaypoints(data) {
  let waypoints = data.waypoints
  let parsedWaypoints = waypoints.map(waypoint => {
    let parts = waypoint.name.split(" ")
    return {
      name : parts[0],
      count : parts[1],
      lat : waypoint.lat,
      lon : waypoint.lon
    }
  })
  return parsedWaypoints
}

// Returns a route
function parseTrack(data) {
  let tracks = data.tracks
  let parsedTracks = tracks.map(track => {
    return {
      name : track.name,
      segments: track.segments
    }
  })
  return parsedTracks
}

function parser() {
  gpxParse.parseGpxFromFile("./files/mytracks01.gpx", function(error, data) {
    let waypoints = parseWaypoints(data);
    let tracks = parseTrack(data);

//    console.log(util.inspect(baseDocumentParts, {showHidden: false, depth: null}))
    console.log(util.inspect(waypoints, {showHidden: false, depth: null}))
    console.log(util.inspect(tracks, {showHidden: false, depth: null}))
    console.log(util.inspect(data, {showHidden: false, depth: null}))

  })
}

module.exports = {
  "parser" : parser
}

