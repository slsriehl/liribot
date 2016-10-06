var request = require('request');
var spotify = require('spotify');
var fs = require('fs');
var keys = require('./keys.js');
var querystring = require('querystring');
var random = require('./random.js');

var command = process.argv[2];
var argument = process.argv[3];
var output;

function myTweets() {
	var params = {
		screen_name: 'lexiconman'
	};
	var twitterKeys = keys.twitterKeys;
	twitterKeys.get('statuses/user_timeline', params, function(error, tweets, response) {
		if(!error) {
			for(var t = 0; t < tweets.length; t++) {
				output = ('\n' + '@' + params.screen_name + ' said ' + tweets[t].text + ' at ' + tweets[t].created_at +'\n');
				console.log(output);
				append();
			}
		} else {
			console.log('twitter error');
		}
	});
}

function spotifyThisSong() {
	if(argument == null) {
		argument = 'The Sign Ace of Base';
	}
	spotify.search({type: 'track', query: argument}, function(error, data) {
		var thisSong;
			if(!error && (data.tracks.items.length >= 1)) {
				thisSong = data.tracks.items[0];
				var artistConcat = thisSong.artists[0].name;
				for(var a = 1; a < thisSong.artists.length; a++) {
					artistConcat += ', ' + thisSong.artists[a].name;
				}
				output = ('\nSong Info \n\nArtist: ' + artistConcat + '\n\nSong Title: ' + thisSong.name + '\n\nOriginal Album: ' + thisSong.album.name + '\n\nPreview: ' + thisSong.preview_url + '\n');
				console.log(output);
				append();
			
			} else {
				console.log('spotify error or there is no song matching that title.');
			}
		});
}

function movieThis() {
	if(argument == null) {
		argument = 'Mr. Nobody';
	}
	var queryProps = {
		t: argument,
		plot: 'full',
		r: 'json',
		tomatoes: true
	}
	var queryUrl = 'http://www.omdbapi.com/?' + querystring.stringify(queryProps);

	request(queryUrl, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			output = ('\nMovie Info \n\nTitle: ' + JSON.parse(body)['Title'] + '\n\nRelease Date: ' + JSON.parse(body)['Released'] + '\n\nIMDB Rating: ' + JSON.parse(body)['imdbRating'] + '\n\nProduction Country: ' + JSON.parse(body)['Country'] + '\n\nLanguage: ' + JSON.parse(body)['Language'] + '\n\nSynopsis: ' + JSON.parse(body)['Plot'] + '\n\nActors: ' + JSON.parse(body)['Actors'] + '\n\nRotten Tomatoes Rating: ' + JSON.parse(body)['tomatoRating'] + '\n\nLearn more at Rotten Tomatoes: ' + JSON.parse(body)['tomatoURL'] + '\n');
			console.log(output); 
			append();
		} else {
			console.log('omdb error or nothing matches your search.');
		}
	});
}
function doWhatItSays() {
	var pickRandom = Math.floor(Math.random() * random.commands.length);
	command = random.commands[pickRandom].comm;
	argument = random.commands[pickRandom].argu;
	output = ("\nyou've selected the random command " + random.commands[pickRandom].comm + " to learn more about " + random.commands[pickRandom].argu + '.\n');
	choose();
	append();
}

function choose() {
	switch(command) {
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

}

function append() {
	fs.appendFile('log.txt', output, function callback(error) {
		if(!error) {
			console.log('this data has been added to your log.');
		} else {
			console.log("sorry, the data didn't write to file.");
		}
	});
}

choose();