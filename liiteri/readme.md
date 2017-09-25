# Liiteri

Extremely simple datastore API to persist JSON data.

# Setup

The service works as a Docker container. Since it saves data to filesystem write permissions must be given to the `data` and `errors` directories.

1) Copy files and folders that are on Git (i.e. all except for data and errors) to the host
1) `make setup`
1) `docker-compose up -d`

To test, add your endpoint URL to example-post.txt and run it with VSCode's *Rest Client extension* (Ctrl - Alt - R).

## Features

Post JSON data with an ide into endpoint. Overwrite is not allowed by default, but can be enabled with a query parameter. Data API key required.

**TODO** Example: ADD URL

Get the JSON data using the id. Data API key required.

**TODO** Example: ADD URL

## TODO

- Required fields: id, data
- Data security
- Require apikey
- Create /var/www/data with Dockerfile
