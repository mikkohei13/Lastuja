<?php

require "vendor/autoload.php";

use Abraham\TwitterOAuth\TwitterOAuth;

require_once "../../lastuja-tweetapi.php";

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);


$content = $connection->get("search/tweets", ["q" => "#tornientaisto", "count" => 100]);

$images = Array();

foreach ($content->statuses as $tweet)
{

//	print_r ($tweet); // debug

	if (isset($tweet->entities->media))
	{
		$mediaFiles = $tweet->entities->media;
		$text = $tweet->text;

		foreach ($mediaFiles as $file)
		{
			$file = $file->media_url;
			$hash = sha1($file);

			$images[$hash]['url'] = $file;
			$images[$hash]['text'] = $text;
		}
	}
} 

foreach ($images as $hash => $arr)
{
	echo "<img src='" . $arr['url'] . "' /><br />";
	echo $arr['text'];
}




