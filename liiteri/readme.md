# Liiteri

Extremely simple datastore API to persist JSON data.

# Setup

The service works as a Docker container. Since it saves data to filesystem write permissions must be given to the `data` directory.

To test, run the example-post.txt with Rest Client extension for VSCode (Ctrl - Alt - R).

## Features

Post JSON data with an ide into endpoint. Overwrite is not allowed by default, but can be enabled with a query parameter. Data API key required.

Example: ADD URL

Get the JSON data using the id. Data API key required.

Example: ADD URL

## TODO

- Required fields: id, data
- Data security
- Require apikey
- Create /var/www/data with Dockerfile
