<?php

$text = "02780";
$url = "https://oiva.evira.fi/kohteet/basic/?text=" . $text . "&ov=1.2.1&mode=";

$dataJSON = file_get_contents($url);
 
$dataArr = json_decode($dataJSON, TRUE);

//header('Content-Type: application/json; charset=utf-8');
print_r($dataArr);

/*

Arvosanat
1 = oivallinen
2 = hyvä
3 = korjattavaa

Kohdetyypit

3 = myllyt ja leipomot
8 = myymälä
9 = ravintola
11 = kahvila
13 = ruokala

*/
