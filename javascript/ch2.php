<pre>
BEGIN
<script>
"use strict";

var g = "globaali";

function test()
{
	console.log( this.g ); // globaali in non-strict mode, undefined in strict mode, because ... ?
}

test();

console.log( this.g );

</script>
END
