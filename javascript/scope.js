<pre>
BEGIN
<script>
"use strict";

/*
Examples partly based on You Don't Know JS (book series) by Kyle Simpson
https://github.com/getify/You-Dont-Know-JS
licensed under a Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License.
http://creativecommons.org/licenses/by-nc-nd/3.0/
*/

// ============================================
// ORDER
/*

function test() {

    console.log(a); // undefined, but no error because a is defined in the scope
    var a = 3;

    console.log(b); // ReferenceError

}

test();
*/

// ============================================
// FUNCTION-EXPRESSION

/*
(function foo(){ // <-- insert this

    var a = 3;
    console.log( a ); // 3

})(); // <-- and this
*/


// ============================================
// ASYNC CLOSURE

/*
for (var i=1; i<=5; i++) {
    setTimeout( function timer(){
        console.log("timeout no. " + i ); // refers to globally scoped variable!
    }, i*1000 );
    console.log("latter no. " + i);
}
*/
/*
prints out:
latter no. 1
latter no. 2
latter no. 3
latter no. 4
latter no. 6
latter no. 6
timeout no. 6
timeout no. 6
timeout no. 6
timeout no. 6
timeout no. 6
timeout no. 6
*/

/*
// This is probably the bahaviour that we are after
for (var i=1; i<=5; i++) {
    (function(){
    	var j = i; // declares a variable that is scoped inside this function - essentially a per-iteration block scope
        setTimeout( function timer(){
            console.log("timeout no. " + j );
        }, j*1000 );
    })();
}
*/

// using let to create a block-scope
/*

for (var i=1; i<=5; i++) {
    	let j = i;
        setTimeout( function timer(){
            console.log("timeout no. " + j );
        }, j*1000 );
}

*/

// ============================================
// REVEALING MODULE

function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];

    function doSomething() { //  has a closure over the inner scope of the module "instance"
        console.log( something );
    }

    function doAnother() {
        console.log( another.join( ", " ) );
    }

    function changeSomething(changeTo) {
        something = changeTo;
    }

     // returns an object - public API for the module
     var publicAPI = { 
        doSomething: doSomething, // reference to inner function, but not to variables
        doAnother: doAnother,
        changeSomething: changeSomething
    };
    return publicAPI;
}

var foo = CoolModule(); // invocation of the module function

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
foo.changeSomething("warm");
foo.doSomething(); // warm


</script>
END