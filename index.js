var request = require('request');
var spotify = require('spotify');
var fs = require('fs');
var keys = require('./keys.js');


function myTweets() {
	var params = {
		screen_name: 'lexiconman'
	};
	var twitterKeys = keys.twitterKeys;
	twitterKeys.get('statuses/user_timeline', params, function(error, tweets, response) {
		if(!error) {
			for(var t = 0; t < tweets.length; t++) {
				console.log('\n' + '@' + params.screen_name + ' said ' + tweets[t].text + ' at ' + tweets[t].created_at +'\n');
			}
		} else {
			console.log('twitter error');
		}
	});
}

function spotifyThisSong() {
	var spotQuery = process.argv[3];
	if(!process.argv[3]) {
		spotQuery = 'The Sign Ace of Base';
	}
	spotify.search({type: 'track', query: spotQuery}, function(error, data) {
		console.log(data.tracks.items[0].artists);
		var thisSong;
			if(!error && (data.tracks.items.length >= 1)) {
				thisSong = data.tracks.items[0];
				var artistConcat = thisSong.artists[0].name;
				for(var a = 1; a < thisSong.artists.length; a++) {
					artistConcat += ', ' + thisSong.artists[a].name;
				}
				console.log('\nArtist: ' + artistConcat + '\nSong Title: ' + thisSong.name + '\nOriginal Album: ' + thisSong.album.name + '\nPreview: ' + thisSong.preview_url + '\n');
			
			} else {
				console.log('spotify error or there is no song matching that title.');
			}
		});
}

function movieThis() {

}
function doWhatItSays() {

}

switch(process.argv[2]) {
	case 'my-tweets':
		myTweets();
		break;
	case 'spotify-this-song':
		spotifyThisSong();
		break;
	case 'movie-this':
		movieThis();
		break;
	case 'do-what-it-says':
		doWhatItSays();
		break;
	default:
		console.log("I don't know how to do that.  Please try again!");
}