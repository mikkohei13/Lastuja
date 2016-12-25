
console.log("Elastic");
console.log("=====================");

/*
Check if return exact matches or partial matches
*/

$(document).ready(function() {
	$("#query").text("Total");
	getAll();
	let debugName = "Parus major"; dataQuery(debugName); $("#query").text("Debugging with " + debugName); // DEBUG
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
//			getSpecies(species); // OLD function call
			dataQuery(species); // NEW function call
		}
//		console.log(species);
	}
});

function dataQuery(species) {
	let queryData = JSON.stringify({
    	"query" : {
        	"term" : {
        		"species" : species
        	}
    	},
    	"aggregations" : {
    		"observationsPerMonth" : {
    			"terms" : {
    				"field" : "month",
    				"size" : 12
    			}
    		}
    	}
	});
	console.log(queryData);

	$.ajax({
		method: "POST",
		url: "http://192.168.56.10:9200/baltic-aves/_search",
		data: queryData,
		beforeSend: function (xhr) {
		    xhr.setRequestHeader ("Authorization", "Basic " + btoa("elastic" + ":" + "changeme"));
		}
	})
	.done(function(dataobject) {
		console.log(dataobject);
		let observationsPerMonth = getObservationsPerMonth(dataobject);
		let count = dataobject.hits.total;
		let countFormatted = count.toLocaleString();
		$("#total").text(countFormatted);
	});
}

function getObservationsPerMonth(dataobject)
{
	let monthlyBuckets = dataobject.aggregations.observationsPerMonth.buckets;
	let monthlyObservations;

	console.log(monthlyBuckets);

/*
	for (var i = monthlyBuckets.length - 1; i >= 0; i--) {
		monthlyObservations[monthlyBuckets[i].key] = monthlyBuckets[i].doc_count;
	}
*/
	console.log(monthlyObservations);

	return "test";
}

function getSpecies(species) {
	$.ajax({
		method: "GET",
		url: "http://192.168.56.10:9200/baltic-aves/_search?q=species:" + species,
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
