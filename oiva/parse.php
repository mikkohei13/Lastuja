<?php

$text = "02780";
$url = "https://oiva.evira.fi/kohteet/basic/?text=" . $text . "&ov=1.2.1&mode=";

$dataJSON = file_get_contents($url);
 
$dataArr = json_decode($dataJSON, TRUE);

//header('Content-Type: application/json; charset=utf-8');
print_r($dataArr);
