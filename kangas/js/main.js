
var w = $( window ).width();
var h = $( window ).height();

$( "#kangas" ).css( "width", w );
$( "#kangas" ).css( "height", h );

var x = w-20; // object size
var y = h-20;

var d = $( "#elio" ).width();
var r = d / 2;

console.log(x);
console.log(y);


var i = 0;
var dur = 1500;

/*
while (i < 30)
{
  goToRandom(dur - (i * 50));
  i++;
}
*/

$( "#elio" ).click(function() {
  goToRandom(dur - (1300));
//  $( "#elio" ).css( "transform", "rotate(180deg)" );
});

/*
while (i < 10)
{
  dur = 1500 - (i * 100);

  $( "#elio" ).animate({
      top: y,
      left: x,
  }, dur);
  $( "#elio" ).animate({
      top: y,
      left: 0,
  }, dur);
  $( "#elio" ).animate({
      top: 0,
      left: x,
  }, dur);
  $( "#elio" ).animate({
      top: 0,
      left: 0,
  }, dur);

  i++;

}
*/

function goToRandom(durLocal)
{
  $( "#elio" ).animate({
      top: Math.random() * y,
      left: Math.random() * x,
  }, durLocal);
  console.log("moved randomly, duration: " + durLocal);

//  var klon = $("#elio").clone().prop('id', 'klon');
}
