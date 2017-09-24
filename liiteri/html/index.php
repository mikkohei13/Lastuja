<?php
define("DATADIRECTORY",     "../data/");

// TODO: This comes later from POST
//$dataArr['name'] = "Jan-Håkan Nilsson-Svensson";
//$dataArr['rand'] = rand(0,1000);
//$id = "JA.4";

$json = file_get_contents('php://input');
$dataArr = json_decode($json, TRUE);

if (FALSE === $dataArr)
{
    response(TRUE, "Payload is not valid JSON", $id, $hashId);
}
if (!isset($dataArr['id']) || empty($dataArr['id']))
{
    response(TRUE, "id must be set", $id, $hashId);    
}

//print_r ($json); exit(); // debug

$id = $dataArr['id'];

// TODO: Security

// TODO: read
// TODO: delete?

// Use hashed id as identifier, to avoid probelms with special characters.
$hashId = sha1($id);

if (file_exists(DATADIRECTORY . $hashId) && !isset($_GET[overwrite]))
{
    response(TRUE, "Data exists, provide overwrite flag to save", $id, $hashId);
}

$bytesWritten = writeFile($id, $hashId, $dataArr);
if (FALSE === $bytesWritten)
{
    response(TRUE, "Unable to save", $id, $hashId);
}
else
{
    response(FALSE, "OK", $id, $hashId);
}



// FUNCTIONS

function writeFile($id, $hashId, $dataArr) {
    $jsonapiDataArr['attributes'] = $dataArr;
    $jsonapiDataArr['id'] = $id;
    $jsonapiDataArr['type'] = "data-v0.1";
    
    $json = json_encode($jsonapiDataArr);
    $fileName = DATADIRECTORY . $hashId;

    return file_put_contents($fileName, $json);    
}

// TODO: Format as json-api
function response($error = TRUE, $message = "Unspecified error", $id = "", $hashId) {
    $responseArr['error'] = $error;
    $responseArr['message'] = $message;
    $responseArr['id'] = $id;
    $responseArr['hashId'] = $hashId;
    
    $responseJson = json_encode($responseArr);

    if (!headers_sent())
    {
        header('Content-Type: application/json');
    }
    echo $responseJson;
    exit();
}