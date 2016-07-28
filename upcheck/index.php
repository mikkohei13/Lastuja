<?php

// config
$URLtoCheck = "http://192.168.56.10/lastuja/upcheck/client.php";

$json = file_get_contents($URLtoCheck);
$dataArr = json_decode($json, TRUE);

print_r ($dataArr); // debug

