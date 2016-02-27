<pre>
BEGIN
<script>
"use strict";

function test() {

    console.log(a); // undefined, but no error because a is defined in the scope
    var a = 3;

    console.log(b); // ReferenceError

}

test();


</script>
END