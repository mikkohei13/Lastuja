
console.log("Elastic");
console.log("=====================");


$("#species").blur(function() {
	let species = $("#species").val();
//	console.log(species);
	getSpecies(species);
});

function getSpecies(species) {
	$.ajax({
		method: "GET",
		url: "http://192.168.56.10:9200/gbif5/_search?q=species:" + species,
		crossDomain: true,
		beforeSend: function (xhr) {
		    xhr.setRequestHeader ("Authorization", "Basic " + btoa("elastic" + ":" + "changeme"));
		}
	})
	.done(function(data) {
//		console.log( data );
		let count = data.hits.total;
		let countFormatted = count.toLocaleString();
		$("#total").text(countFormatted);
	});
}

/*



*/
