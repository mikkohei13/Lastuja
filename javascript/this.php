<pre>
BEGIN
<script>
//"use strict";

/*
Examples partly based on You Don't Know JS (book series) by Kyle Simpson
https://github.com/getify/You-Dont-Know-JS
licensed under a Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License.
http://creativecommons.org/licenses/by-nc-nd/3.0/
*/

// ============================================
// CALL-STACK / SITE

/*
function baz() {
    // call-stack is: `baz`
    // so, our call-site is in the global scope

    console.log( "baz" );
    bar(); // <-- call-site for `bar`
}

function bar() {
    // call-stack is: `baz` -> `bar`
    // so, our call-site is in `baz`

    console.log( "bar" );
    foo(); // <-- call-site for `foo`
}

function foo() {
    // call-stack is: `baz` -> `bar` -> `foo`
    // so, our call-site is in `bar`


	debugger; // pauses execution
    console.log( "foo" );
}

baz(); // <-- call-site for `baz`
*/

// ============================================
// THIS RULES

/*
function foo() {
    console.log( this.a );
}
var obj = {
    a: 2,
    foo: foo
};
obj.foo(); // prints out 2
var bar = obj.foo; // function reference/alias, NOT object reference (?)
console.log(bar);
var a = "3 oops";
bar(); // prints out "3, global" - call site is standalone, so falling back to default

*/

// HARD BINDING

function foo(something) {
    console.log( this.a, something ); // prints "2 3"
    return this.a + something; // returns 2 + 3 = 5
}

var obj = {
    a: 2
};

var bar = foo.bind( obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5



</script>
END