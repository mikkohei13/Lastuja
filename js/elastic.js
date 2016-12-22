
console.log("Elastic");
console.log("=====================");


$(document).ready(function() {
	$("#query").text("Total");
	getAll();
});

$("#species").keypress(function(event) {
	if (event.which == 13) {
		let species = $("#species").val();
		if (species == "")
		{
			$("#query").text("Total");
			getAll();
		}
		else
		{
			$("#query").text(species);
			getSpecies(species);
		}
//		console.log(species);
	}
});

function getSpecies(species) {
	$.ajax({
		method: "GET",
		url: "http://192.168.56.10:9200/baltic-aves/_search?q=species:" + species,
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

function getAll(species) {
	$.ajax({
		method: "GET",
		url: "http://192.168.56.10:9200/baltic-aves/_search",
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

Javascript-based UI for making basic analysis of the data

Species:
Record count: absolute & proportion of class/order
Year histogram: absolute & relative to class/order
Month histogram of all years

Map:
Species on a map, clustered
Species count of selected taxon on a map, clustered


*/
