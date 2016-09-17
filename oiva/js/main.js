
$( "#searchform" ).submit(function( event ) {

  $.get( "parse.php?q=02210", function( data ) {
    $( "#result" ).html( data );
  });

  event.preventDefault();
});