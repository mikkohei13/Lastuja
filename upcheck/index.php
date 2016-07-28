<?php

// config
$URLtoCheck = "http://192.168.56.10/lastuja/upcheck/client.php";
$logFile = "logs/" . sha1($URLtoCheck) . ".txt";

$serverDatetime = date(DateTime::ISO8601);

// Fetch data
$start = microtime(TRUE);
$json = file_get_contents($URLtoCheck);
$end = microtime(TRUE);

$responseTime = $end - $start;

$dataArr = json_decode($json, TRUE);

//print_r ($dataArr); // debug
$logString = $URLtoCheck . "\t" . $serverDatetime . "\t" . $dataArr['status'] . "\t" . $dataArr['datetime'] . "\t" . $responseTime;

$logSuccess = file_put_contents(($logFile), ($logString . "\n"), FILE_APPEND);

echo $logSuccess . "\t" . $logString . "\tEND";