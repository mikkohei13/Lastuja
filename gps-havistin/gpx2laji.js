const gpxParse = require('gpx-parse')
let baseDocumentParts = require('./baseDocumentParts')
const util = require('util')

function parser() {
  gpxParse.parseGpxFromFile("./files/mytracks01.gpx", function(error, data) {

    now = new Date

    // Units
    let baseUnits = parseWaypoints(data)

    // Geometry
    let tracksAndName = parseTrack(data.tracks)
    let dateBegin = tracksAndName.dateBegin
    let baseGeometry = tracksAndName.geometry
    let tracksName = tracksAndName.name + " (parsed by gpx2laji on " + now.toISOString() + ")"

    let document = baseDocumentParts.baseDocument
    document.gatherings[0].units = baseUnits
    document.gatherings[0].geometry.geometries[0] = baseGeometry
    document.gatherings[0].notes = tracksName
    document.gatheringEvent.dateBegin = dateBegin

    console.log(JSON.stringify(document, null, 2));
//    console.log(util.inspect(document, {showHidden: false, depth: null}))
//    console.log(util.inspect(baseUnits, {showHidden: false, depth: null}))
//    console.log(util.inspect(baseGeometry, {showHidden: false, depth: null}))
//    console.log(util.inspect(data, {showHidden: false, depth: null}))

  })
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
  "parser" : parser
}
