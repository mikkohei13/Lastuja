const gpxParse = require('gpx-parse')
let baseDocumentParts = require('./baseDocumentParts')
const util = require('util')

// Returns an array of waypoints
function parseWaypoints(data) {
  let waypoints = data.waypoints

  // Go through waypoints, assign to parsedWaypoints array
  let unitHelper = {}
  let parsedWaypoints = waypoints.map(waypoint => {
    let nameParts = waypoint.name.split(" ")
    unitHelper = {
      "recordBasis": "MY.recordBasisHumanObservation",
      "taxonConfidence": "MY.taxonConfidenceSure",
      "count": nameParts[1],
      "identifications": [
        {
          "taxon": nameParts[0]
        }
      ],
      "unitGathering": {
        "geometry": {
          "type": "Point",
          "coordinates": [
            waypoint.lon,
            waypoint.lat
          ]
        }
      }
    }
    return unitHelper
  })

  return parsedWaypoints
}

// Returns a route
function parseTrack(data) {
  let tracks = data.tracks

  let geometryHelper = {}

  // Go through tracks (assume there's only one), assign to parsedTracks
  let parsedTracks = tracks.map(track => {

    geometryHelper.name = track.name
    let segments = track.segments[0] // take the first array item
//    console.log("segments:");
//    console.log(segments);

    // Go through segments, assign to parsedSegments
    let parsedSegments = segments.map(segment => {
      return [segment.lon, segment.lat]
    })

    geometryHelper.coordinates = parsedSegments
//    console.log("Here comes geometryHelper");
//    console.log(geometryHelper);


    return geometryHelper
  })

//  console.log(geometryHelper);

  let ret = {
    name : geometryHelper.name,
    geometry : {
      "type": "LineString",
      "coordinates": geometryHelper.coordinates
    }
  }

  return ret;
}

function parser() {
  gpxParse.parseGpxFromFile("./files/mytracks02-pkkorset.gpx", function(error, data) {

    // Units
    let baseUnits = parseWaypoints(data)

    // Geometry
    let tracksAndName = parseTrack(data)
    let baseGeometry = tracksAndName.geometry
    let tracksName = tracksAndName.name

    let document = baseDocumentParts.baseDocument
    document.gatherings[0].units = baseUnits
    document.gatherings[0].geometry.geometries[0] = baseGeometry
    document.gatherings[0].notes = tracksName

    console.log(JSON.stringify(document, null, 2));
//    console.log(util.inspect(document, {showHidden: false, depth: null}))
//    console.log(util.inspect(baseUnits, {showHidden: false, depth: null}))
//    console.log(util.inspect(baseGeometry, {showHidden: false, depth: null}))
//    console.log(util.inspect(data, {showHidden: false, depth: null}))

  })
}

module.exports = {
  "parser" : parser
}
