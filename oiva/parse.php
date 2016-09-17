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
//	$simpleDataArr[$id]['katu'] = $restaurantArr['katuosoite'];
	$simpleDataArr[$id]['kunta'] = $restaurantArr['kuntaNimiFi'];
	$simpleDataArr[$id]['tunnus'] = $restaurantArr['tunnus'];

	$reportCount = 0;
	$reportGradeTotal = 0;
	$latestReportDate = 0;

	// Reports
	foreach ($restaurantArr['raporttiList'] as $reportNumber => $reportArr)
	{
		if ($reportArr['tarkastusPaiva'] > $latestReportDate)
		{
			$latestReportDate = $reportArr['tarkastusPaiva'];
			$latestReportCode = $reportArr['tarkastusTunnus'];
		}

		$reportGradeTotal = $reportGradeTotal + $reportArr['arvosana'];
		$reportCount++;
	}

	$simpleDataArr[$id]['latestReportCode'] = $latestReportCode;
	$simpleDataArr[$id]['latestReportURL'] = "https://oiva.evira.fi/kohteet/" . $simpleDataArr[$id]['tunnus'] . "/raportit/" . $simpleDataArr[$id]['latestReportCode'] . "/pdf";

	$simpleDataArr[$id]['gradeAverage'] = round(($reportGradeTotal / $reportCount), 1);
	$simpleDataArr[$id]['gradeAverageName'] = getGradeName($simpleDataArr[$id]['gradeAverage']);
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


header('Content-Type: text/html; charset=utf-8');
if (isset($_GET['debug']))
{
	print_r($simpleDataArr);
	print_r($dataArr);
}
else
{

	echo "<table>";
	echo "<tr>";
	echo "<th>Ravintola</th>";
	echo "<th colspan=\"2\">arvosana</th>";
	echo "<th>tarkastuksia</th>";
	echo "<th>Uusin raportti</th>";
	echo "</tr>";

	foreach ($simpleDataArr as $key => $restaurant)
	{
		echo "<tr>";
		echo "<td>" . $restaurant['name'] . "<br />" . $restaurant['kunta'] . "</td>";
		echo "<td>" . $restaurant['gradeAverage'] . "</td>";
		echo "<td>" . $restaurant['gradeAverageName'] . "</td>";
		echo "<td>" . $restaurant['reportCount'] . "</td>";
		echo "<td><a href='" . $restaurant['latestReportURL'] . "'>PDF</a></td>";
		echo "</tr>";
	}
	echo "</table>";

}


// --------------------

function getGradeName($gradeDecimal)
{
	$gradeInt = round($gradeDecimal, 0);
	$gradeNames[4] = "huono";
	$gradeNames[3] = "korjattavaa";
	$gradeNames[2] = "hyvä";
	$gradeNames[1] = "erinomainen";

	return $gradeNames[$gradeInt];
}


