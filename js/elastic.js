
console.log("Elastic");
console.log("=====================");

$(document).ready(function() {

	$.ajax({
		method: "GET",
		url: "http://192.168.56.10:9200/gbif5/_search?q=species:Somateria%20mollissima",
		crossDomain: true,
		beforeSend: function (xhr) {
		    xhr.setRequestHeader ("Authorization", "Basic " + btoa("elastic" + ":" + "changeme"));
		}
	})
	.done(function( data ) {
		console.log( data );
		$("#total").text(data.hits.total);
	});

});


/*



*/
