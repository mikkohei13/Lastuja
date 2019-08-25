
Tools for accessing iNaturalist API.

# TODO:

- Learn the API and how to fetch new and updated observations
- Compare Finnish names to Laji.fi names
  - Compare iNat Finnish names to Laji.fi Finnish names, by connecting them with sciname
  - How many of Finnish species are found in the taxonony, and how many of them have names?

# Notes

Observations, all grades (25.8.2019)
- Finland 18722 (c. 5% marked as captive/cultivated - do we want these also? No.)
- Estonia 3425
- Sweden 35828
- Norway 30872
- Russia (are these areas overlapping?)
  - Republic of Karelia 6587 (bounding box, includes some of Finland also)
  - Murmansk Oblast 1223
  - Leningrad Oblast 10641 (bounding box) 
- Total c. 107,000

Licenses?

Data export tool: https://www.inaturalist.org/observations/export
quality_grade=any&identifications=any&captive=false&place_id=118841

There are two API's:

## Write-Read API

https://www.inaturalist.org/pages/api+reference

- More functionality, used internally
- Here's instructions how to get OAuth access token
- Ruby on Rails

## Read-only API v1

https://api.inaturalist.org/v1/docs/

- Read-only observations and stats, recommended for this
- Faster, more consistent responses
- Node
- Max 60 (100) requests / minute, under 10,000 requests / day

Multiple values for a single URL parameter should be separated by commas, e.g. taxon_id=1,2,3.

Authentication in the Node API is handled via JSON Web Tokens (JWT). To obtain one, make an OAuth-authenticated request to https://www.inaturalist.org/users/api_token. Each JWT will expire after 24 hours. Authentication required for all PUT and POST requests. Some GET requests will also include private information like hidden coordinates if the authenticated user has permission to view them.

API is intended to support application development, not data scraping.

https://api.inaturalist.org/v1/docs/#!/Observations/get_observations

Finland place_id 7020

updated_since
- format: 2019-08-24T00:00:00+03:00
- time?
- is comment an update? is changed community id an update?



## See also

- Annotated photos (5,089 species, 675,000 images) for computer vision training etc.: https://www.kaggle.com/c/inaturalist-challenge-at-fgvc-2017
- DwCA (400+ MB) of research-grade observations, updated weekly http://www.inaturalist.org/observations/gbif-observations-dwca.zip

## Notes about the data

Records have varying CC licenses, or no license at all (=all rights reserved).
What to do if license is missing, or noncommercial. Remove free text fields? Save free text into field, which is not downloadable?

iNat APi field  DW field  notes
out_of_range    true|false|empty
quality_grade
- research = community convincing, has media
- needs id = neutral grade, has media
- casual = neutral grade, no media
uuid
id    this is the public unique id
observed_on_details->date day begin always a single date. Or: observed_on
created_at_details->date  date created  edited date??
positional_accuracy   meters
public_positional_accuracy    meters, which to use?
license_code    cc-code or empty (all rights reserved)
captive   true|false
place_ids these need to get from the api
taxon->name taxon
current_synonymous_taxon_ids  ??
geojson
owners_identification_from_vision true|false
location  is this always coord string like "68.1666667,28.2500001"?
spam  BOOL
user->login username
user->spam BOOL
user->suspended BOOL
user->orcid 
user->observations_count
photos, observation_photos  what's the difference? where to put count?

--

out_of_range (true | false | empty): is the observation outside "known range" of the taxon
  true => needsChecking, created by system

user_login > use api to get full name, if exists

quality_grade
- research = community convincing, has media
- needs id = neutral grade, has media
- casual = neutral grade, no media
description

num_identification_agreements
num_identification_disagreements
captive_cultivated


## Translations to fix

harrastelija
mies
nainen


