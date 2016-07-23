<?php

$text = "02780";
$url = "https://oiva.evira.fi/kohteet/basic/?text=" . $text . "&ov=1.2.1&mode=";

$dataJSON = file_get_contents($url);
 
$dataArr = json_decode($dataJSON, TRUE);

$simpleDataArr = Array();

foreach ($dataArr as $number => $restaurantArr)
{
	$id = sha1($restaurantArr['uniqueKey']);
	$simpleDataArr[$id]['name'] = $restaurantArr['markkinointiNimi'];

	$reportCount = 0;
	$reportGradeTotal = 0;

	foreach ($restaurantArr['raporttiList'] as $reportNumber => $reportArr)
	{
		$reportGradeTotal = $reportGradeTotal + $reportArr['arvosana'];
		$reportCount++;
	}

	$simpleDataArr[$id]['gradeAverage'] = round(($reportGradeTotal / $reportCount), 1);
}

//header('Content-Type: application/json; charset=utf-8');
print_r($simpleDataArr);
print_r($dataArr);


/*

Arvosanat
1 = oivallinen
2 = hyvä
3 = korjattavaa
4 = huono

Kohdetyypit
3 = myllyt ja leipomot
8 = myymälä
9 = ravintola
11 = kahvila
13 = ruokala


*/
