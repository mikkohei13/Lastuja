
let baseDocument = {
  "creator": "MA.3",
  "gatheringEvent": {
    "legPublic": true,
    "leg": [
      "MA.3"
    ],
    "dateBegin": "2018-02-18"
  },
  "formID": "JX.519",
  "editors": [
    "MA.3"
  ],
  "secureLevel": "MX.secureLevelNone",
  "gatherings": [
    {
      "units": [
          // units here
      ],
      "geometry": {
        "type": "GeometryCollection",
        "geometries": [
            // geometries here
        ]
      },
      "notes": "" // Track name here
    }
  ],
  "keywords": [
    "havistin",
    "gpx"
  ],
  "publicityRestrictions": "MZ.publicityRestrictionsPublic"
};

let baseUnit = {
    "recordBasis": "MY.recordBasisHumanObservation",
    "taxonConfidence": "MY.taxonConfidenceSure",
    "count": "1",
    "identifications": [
      {
        "taxon": "picpic"
      }
    ],
    "unitGathering": {
      "geometry": {
        "type": "Point",
        "coordinates": [
          18.24526,
          59.328291
        ]
      }
    }
  };

let baseGeometry = {
    "type": "LineString",
    "coordinates":
    [
        [
        18.252975,
        59.326329
        ],
        [
        18.25186,
        59.326136
        ],
        [
        18.250659,
        59.325532
        ]
    ]
};

module.exports = {
    "baseDocument" : baseDocument,
    "baseGeometry" : baseGeometry,
    "baseUnit" : baseUnit
};
