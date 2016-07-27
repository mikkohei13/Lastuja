<?php
header('Content-Type: text/html; charset=utf-8');

$qRaw = $_GET['q'];
$q = urlencode(utf8_decode($qRaw));
$url = "https://oiva.evira.fi/kohteet/basic/?text=" . $q . "&ov=1.2.1&mode=";

//exit($url); // debug

$dataJSON = file_get_contents($url);
 
$dataArr = json_decode($dataJSON, TRUE);

$simpleDataArr = Array();

foreach ($dataArr as $number => $restaurantArr)
{
	$id = sha1($restaurantArr['uniqueKey']);
	$simpleDataArr[$id]['name'] = $restaurantArr['markkinointiNimi'];
	$simpleDataArr[$id]['tyyppi'] = $restaurantArr['kohdetyyppiNimiFi'];
	$simpleDataArr[$id]['katu'] = $restaurantArr['katuosoite'];
	$simpleDataArr[$id]['kunta'] = $restaurantArr['kuntaNimiFi'];

	$reportCount = 0;
	$reportGradeTotal = 0;

	foreach ($restaurantArr['raporttiList'] as $reportNumber => $reportArr)
	{
		$reportGradeTotal = $reportGradeTotal + $reportArr['arvosana'];
		$reportCount++;
	}

	$simpleDataArr[$id]['gradeAverage'] = round(($reportGradeTotal / $reportCount), 1);
	$simpleDataArr[$id]['reportCount'] = $reportCount;
}

// Sort by gradeAverage
uasort($simpleDataArr, function($b, $a) {
	if ($a['gradeAverage'] > $b['gradeAverage'])
	{
	    return 1;
	}
	elseif ($a['gradeAverage'] < $b['gradeAverage'])
	{
	    return -1;
	}
	elseif ($a['gradeAverage'] == $b['gradeAverage'])
	{
	    return 0;
	}
});


//header('Content-Type: application/json; charset=utf-8');
print_r($simpleDataArr);
print_r($dataArr); // debug



