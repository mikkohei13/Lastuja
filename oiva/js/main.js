
$( "#searchform" ).submit(function( event ) {

  var searchterm = $( "#q" ).val();
  $.get( "parse.php?q="+searchterm, function( data ) {
    $( "#result" ).html( data );
  });

  event.preventDefault();
});