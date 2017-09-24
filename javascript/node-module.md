## JavaScript patterns

# Creating a module

## Main app

Include the module

        const lajiAPI = require('./lajiapi.js'); // .js can be left out ??

Call a method in the module

        lajiAPI.handleQuery(request, response);

## Module file


        function handleQuery(serverRequest, serverResponse) {
            // Do things here
        }

Expose the functions you wish to make public

        module.exports = {
            handleQuery : handleQuery
        };

