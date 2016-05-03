<?php

require "vendor/autoload.php";

use Abraham\TwitterOAuth\TwitterOAuth;

require_once "../../lastuja-tweetapi.php";

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);


$content = $connection->get("search/tweets", ["q" => "#tornientaisto", "count" => 100]);

$imageUrls = Array();

foreach ($content->statuses as $tweet)
{
	if (isset($tweet->entities->media))
	{
		$mediaFiles = $tweet->entities->media;
		foreach ($mediaFiles as $file)
		{
			$file = $file->media_url;
			$imageUrls[$file] = 1;
		}
	}
} 

foreach ($imageUrls as $url => $bool)
{
	echo "<img src='";
	echo $url;
	echo "' /><br />";
}




