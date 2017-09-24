<?php
$file = $_GET("file");
?><!doctype html>

<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>JavaScript examples</title>
    </head>
    <body>
        <h1><?php echo $file;?></h1>
        <script src="<?php echo $file;?>.js"></script>
    </body>
</html>