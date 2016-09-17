<?php
header('Content-Type: text/html; charset=utf-8');
?>

<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Ravintolat Oiva</title>
        <meta name="description" content="Tutustu mitä lintuja koti- tai mökkiseudullasi esiintyy">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <link href='https://fonts.googleapis.com/css?family=Raleway:400,700,400italic,700italic' rel='stylesheet' type='text/css'>

        <link rel="stylesheet" href="css/normalize.min.css">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="css/app.css">


        <!--[if lt IE 9]>
            <script src="js/vendor/html5-3.6-respond-1.4.2.min.js"></script>
        <![endif]-->
    </head>
    <body>

        <div id="header-container">
            <header class="wrapper clearfix">
                <h2 class="title">
                    <a href="./" id="titlelink">
                        Ravintolat
                    </a>
                </h2>
            </header>
        </div>

        <div id="main-container">

        <form id="searchform">
            <input id="q" name ="q" placeholder="hakusana, kunta tai postinumero"></input>
            <input type="submit" value="Hae" id="submit" name="submit"></input>
        </form>

        <div id="result"></div>

        </div> <!-- #main-container -->

        <div id="footer-container">
            <footer class="wrapper">


                <h3>Tietolähteet</h3>

                <h3>Tietosuoja</h3>
                <p>Palvelun käyttöä seurataan <a href="https://www.google.com/policies/privacy/partners/">Google Analytics:in</a> ja evästeiden avulla. Voit halutessasi estää evästeiden käytön selaimestasi.</p>

                <p id="credits">Toteutus: <strong>Mikko Heikkinen / <a href="http://www.biomi.org/">biomi.org</a></strong> | <a href="https://github.com/mikkohei13/Suomen-linnut">Code on Github</a> | <a href="/retkelle/tietosuojaseloste/">Tietosuojaseloste</a></p>

            </footer>
        </div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>

        <script src="js/main.js"></script>

        <?php // include_once "../../googleanalytics.php"; ?>

    </body>
</html>
