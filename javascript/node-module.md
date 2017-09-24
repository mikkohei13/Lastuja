## JavaScript patterns

# Creating a Node.js module

## Main app

Include the module

        const localNameForModule = require('./module-file.js'); // .js can be left out ??

Call a method in the module

        localNameForModule.doSomething(param1, param2);

## Module file

Code and variables are wrapped in functions, which are called through module's local name. This reduces likelihood of name collisions.

        function doSomethingInternalName(internalParam1, internalParam2) {
            // Do things here
        }

Expose the functions you wish to make public

        module.exports = {
            doSomething : doSomethingInternalName
        };

