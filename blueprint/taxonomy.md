FORMAT: 1A

# Taxonomy

Testing API-Blueprint for taxonomy API.

# Group Taxa

Resource group related to taxa.

## Taxon Collection [/taxon/id/{taxon_id}]

Resource for one taxon.

### Show a taxon [GET]

This separates taxon (concept) from its name, but doesn't dictate where the name is stored in the database. Name is displayed with the concept to reduce API calls needed.

Displaying synonyms (isSameAs) and children as objects allows us to expand them later without making breaking changes.

* Response 200 (application/json)

        {
        "taxonId": "string",
        "notes": "string",
        "rank": "string",
        "name": {
            "nameId": "string",
            "scientificName": "string",
            "cursiveName": boolean,
            "scientificNameAuthor": "string",
            "scientificNameYear": "string",
            "scientificNameConcatenated": "string",
            "basionym": "string",
            "vernacularNames": [
                {
                    "lang": "string",
                    "name": "string",
                }
            ]
        },
        "synonyms": [
            {
                "taxonId": "string",
            }
        ],
        "parent": "string", <!-- id of parent taxon -->
        "ancestors": [
            {
                "taxonId": "string",
                "taxonRank": "string",
                "scientificName": "string"
            }
        ],
        "siblings": [
            {
                "taxonId": "string",
            }
        ],
        "children": [
            {
                "taxonId": "string",
            }
        ],
        "taxonomicSortOrder": 0,
        "originalPublication": "string",
        "classification": "string"
        "accepted": boolean
        }

## Taxon Collection [/taxon/search]

Search taxa.

### Search a taxon [GET]

Does a partial search for taxon scientific names.

TODO:
- How to add search parameters

* Response 200 (application/json)

