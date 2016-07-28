<?php
$data = Array();
$data['status'] = "ok";
$data['datetime'] = date(DateTime::ISO8601);
$json = json_encode($data);

header('Content-Type: application/json; charset=utf-8');
echo $json;