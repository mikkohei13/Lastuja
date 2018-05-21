/*
Parses GPX string into an object containing
- laji.fi document
- metadata about the document

{
    document: document,
    waypointCount: waypoints.waypointCount,
    segmentCount: track.segmentCount
}
*/

const gpxParse = require("gpx-parse");
const baseDocumentParts = require("./baseDocumentParts");

let moduleCallback;

// -----------------------------------------------------------
// Private functions

// Returns an array of waypoints
function parseWaypoints(data) {
  const waypoints = data.waypoints;

  // Go through waypoints, assign to parsedWaypoints array
  const parsedWaypoints = waypoints.map((waypoint) => {
    const nameParts = waypoint.name.split(" ");
    const unitHelper = {
      recordBasis: "MY.recordBasisHumanObservation",
      taxonConfidence: "MY.taxonConfidenceSure",
      count: nameParts[1],
      identifications: [
        {
          taxon: nameParts[0],
        },
      ],
      unitGathering: {
        geometry: {
          type: "Point",
          coordinates: [
            waypoint.lon,
            waypoint.lat,
          ],
        },
      },
    };
    return unitHelper;
  });

  return {
    baseUnits: parsedWaypoints,
    waypointCount: waypoints.length,
  };
}

// Returns a route
function parseTrack(tracks) {
  // Catches only the last date
  let dateObject;

  // Go through tracks (assume there's only one), assign to parsedTracks
  const parsedTracks = tracks.map((track) => {
    const segments = track.segments[0]; // take the first array item

    // Go through segments, assign to parsedSegments array as subarrays with two elements
    const parsedSegments = segments.map((segment) => {
      dateObject = segment.time;
      return [segment.lon, segment.lat];
    });

    return {
      coordinates: parsedSegments,
      name: track.name,
      segmentCount: (segments.length - 1), // one less segments than segment start/endpoints
    };
  });

  // Return first track [0] in array, since only one track expected
  return {
    name: parsedTracks[0].name,
    geometry: {
      type: "LineString",
      coordinates: parsedTracks[0].coordinates,
    },
    dateBegin: dateObject.toISOString().split("T")[0], // strange error
    segmentCount: parsedTracks[0].segmentCount,
  };
}

const gpxObject2metaDocument = (errorParseGpx, data) => {
  console.log(`Parsing gpx -> gpx-object done, transformer received ${data}`);

  if (errorParseGpx !== null) {
    console.log(`Error in gpxObject2metaDocument: ${errorParseGpx}`);
  }
  else {
    console.log("No errors...");
  }

  // Waypoints -> Units
  const waypoints = parseWaypoints(data);
  const baseUnits = waypoints.baseUnits;

  // Track -> Geometry
  const track = parseTrack(data.tracks);

  // Get base document and assign values to it
  const document = baseDocumentParts.baseDocument;
  const now = new Date();
  document.gatherings[0].notes = `${track.name} (parsed by gpx2laji on ${now.toISOString()})`;
  document.gatherings[0].geometry.geometries[0] = track.geometry;
  document.gatheringEvent.dateBegin = track.dateBegin;
  document.gatherings[0].units = baseUnits;

  //  console.log(JSON.stringify(document, null, 2));

  const documentMeta = {
    document,
    waypointCount: waypoints.waypointCount,
    segmentCount: track.segmentCount,
  };

  // Returns documentMeta object as data to the callback function
  moduleCallback(null, documentMeta);

//    console.log(util.inspect(document, {showHidden: false, depth: null}))
//    console.log(util.inspect(baseUnits, {showHidden: false, depth: null}))
//    console.log(util.inspect(baseGeometry, {showHidden: false, depth: null}))
//    console.log(util.inspect(data, {showHidden: false, depth: null}))
};

// -----------------------------------------------------------
// Public functions

function parseString(gpxString, callback) {
  console.log(`Parser received string beginning with ${gpxString.substring(0, 20)} ...`);
  //  console.log("Parser received string: " + gpxString);

  moduleCallback = callback;
  gpxParse.parseGpx(gpxString, gpxObject2metaDocument);

  /*
  2018-05-19:
  Confusing behaviour in callbacks, maybe caused because variables are passed as reference and/or scoping??
  If callback function tries to use a variable (here it was "document") that doesn't exist in the function scope,
  it tries to get it from the calling function (here "parseString" function). This fires the function again,
  without proper data, which causes it to fail.

  TODO: make this function robust, so that the app does not crash if the function is called without proper parameters.

  */
}

module.exports = {
  parseString,
};
