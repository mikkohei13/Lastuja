
console.log("Closure");
console.log("=====================");


function bird(abbr) {
	var sciname;
	var finame;
	var IUCNstatus;
	var found;

	if ("parmaj" == abbr) {
		sciname = "Parus major";
		finame = "talitiainen";
		IUCNstatus = "LC";
		found = true;
	}
	else if ("autful" == abbr) {
		sciname = "Aythya fuligula";
		finame = "tukkasotka";
		IUCNstatus = "VU";
		found = true;
	}
	else
	{
		found = false;
	}

	function getNamesFormatted() {
		return finame + " (<em>" + sciname + "</em>)\n";
	}

	return function () { return found; }
}

var parmaj = bird("parmaj");
var cyacae = bird("cyacae");

console.log(parmaj);
console.log(cyacae);

console.log("---------------------");

console.log(parmaj.getNamesFormatted());

