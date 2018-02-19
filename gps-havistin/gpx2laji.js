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

    let segments = track.segments[0] // take the first array item

    // Go through segments, assign to parsedSegments array as subarrays with two elements
    let parsedSegments = segments.map(segment => {
      return [segment.lon, segment.lat]
    })

    geometryHelper.coordinates = parsedSegments
    geometryHelper.name = track.name

    return geometryHelper
  })

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

    now = new Date

    // Units
    let baseUnits = parseWaypoints(data)

    // Geometry
    let tracksAndName = parseTrack(data)
    let baseGeometry = tracksAndName.geometry
    let tracksName = tracksAndName.name + " (parsed by gpx2laji on " + now.toISOString() + ")"

    let document = baseDocumentParts.baseDocument
    document.gatherings[0].units = baseUnits
    document.gatherings[0].geometry.geometries[0] = baseGeometry
    document.gatherings[0].notes = tracksName
    document.gatheringEvent.dateBegin = getInternationalDate(now)

    console.log(JSON.stringify(document, null, 2));
//    console.log(util.inspect(document, {showHidden: false, depth: null}))
//    console.log(util.inspect(baseUnits, {showHidden: false, depth: null}))
//    console.log(util.inspect(baseGeometry, {showHidden: false, depth: null}))
//    console.log(util.inspect(data, {showHidden: false, depth: null}))

  })
}

function getInternationalDate(date) {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

module.exports = {
  "parser" : parser
}
