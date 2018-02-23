const gpxParse = require('gpx-parse')
let baseDocumentParts = require('./baseDocumentParts')
const util = require('util')

let moduleCallback;

// Public functions

function parseExample(callback) {
  moduleCallback = callback;
  gpxParse.parseGpxFromFile("./files/mytracks01.gpx", parse);
}

function parseString(gpxString, callback) {
  moduleCallback = callback;
  gpxParse.parseGpx(gpxString, parse);
}


// Private functions

let parse = function parse(error, data) {

  // Units
  let baseUnits = parseWaypoints(data)

  // Geometry
  let track = parseTrack(data.tracks)

  // Get base document and assign values to it
  let document = baseDocumentParts.baseDocument
  now = new Date
  document.gatherings[0].notes = track.name + " (parsed by gpx2laji on " + now.toISOString() + ")"
  document.gatherings[0].geometry.geometries[0] = track.geometry
  document.gatheringEvent.dateBegin = track.dateBegin
  document.gatherings[0].units = baseUnits

//  console.log(JSON.stringify(document, null, 2));

  moduleCallback(null, document);

//    console.log(util.inspect(document, {showHidden: false, depth: null}))
//    console.log(util.inspect(baseUnits, {showHidden: false, depth: null}))
//    console.log(util.inspect(baseGeometry, {showHidden: false, depth: null}))
//    console.log(util.inspect(data, {showHidden: false, depth: null}))

}

// Returns an array of waypoints
function parseWaypoints(data) {
  let waypoints = data.waypoints

  // Go through waypoints, assign to parsedWaypoints array
  let parsedWaypoints = waypoints.map(waypoint => {
    let nameParts = waypoint.name.split(" ")
    let unitHelper = {
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
function parseTrack(tracks) {

  // Catches only the last date
  let dateObject

  // Go through tracks (assume there's only one), assign to parsedTracks
  let parsedTracks = tracks.map(track => {

    let segments = track.segments[0] // take the first array item

    // Go through segments, assign to parsedSegments array as subarrays with two elements
    let parsedSegments = segments.map(segment => {
      dateObject = segment.time
      return [segment.lon, segment.lat]
    })

    return {
      coordinates: parsedSegments,
      name: track.name
    }
  })

  // Return first track [0] in array, since only one track expected
  return {
    name : parsedTracks[0].name,
    geometry : {
      "type": "LineString",
      "coordinates": parsedTracks[0].coordinates
    },
    dateBegin: dateObject.toISOString().split('T')[0]
  }

}

/*
function getInternationalDate(date) {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
*/

module.exports = {
  "parseExample": parseExample,
  "parseString": parseString
}
