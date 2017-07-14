var keyFile = require('./keys.js');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');

var client = new Twitter({
	consumer_key: keyFile.twitterKeys.consumer_key,
	consumer_secret: keyFile.twitterKeys.consumer_secret,
	access_token_key: keyFile.twitterKeys.access_token_key,
	access_token_secret: keyFile.twitterKeys.access_token_secret
});

var spotify = new Spotify({
	id: keyFile.spotifyKeys.id,
	secret: keyFile.spotifyKeys.secret
});

var action = process.argv[2];
var songOrMovie = process.argv[3];

function myTweets(numberTweets) {
	var params = {screen_name: 'ucbe_rm'}; //This looks for the screen_name in twitter to see their tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < numberTweets; i++) {
				var twitterOutput = '\nTweet Number: ' + (i+1) +
				'\nDate Created: ' + tweets[i].created_at +
				'Tweet: ' + tweets[i].text +
				'----------------------------';

				fs.appendFile('log.txt', twitterOutput, (err) => {
				  if (err) throw err;
				});
				console.log(twitterOutput);

			}
	 	}
	 	else if (error) {
			return console.log('Error occurred: ' + error);
		}
	});
}

function spotifySong(limitNumber){
	limitNumber = 10;
	if (songOrMovie == undefined){
		songOrMovie = 'The Sign';
	}
	
	spotify.search({ type: 'track', query: songOrMovie, limit: limitNumber }, function(err, data) {

		// var artist = data.tracks.items[0].artists[0].name;
		// var spotifyTitle = data.tracks.items[0].name;
		// var previewLink = data.tracks.items[0].preview_url;
		// var albumName = data.tracks.items[0].album.name;

		if (err) {
			return console.log('Error occurred: ' + err);
		}

		else {
			if (songOrMovie === 'The Sign') {
				for (var i = 0; i < Object.keys(data.tracks.items).length; i++) {
					var songInfo = '\nSearch Item Number: ' + (i+1) +
						'\nArtist(s): ' + data.tracks.items[i].artists[0].name +
						'\nSong Title: ' + data.tracks.items[i].name +
						'\nPreview Link: ' + data.tracks.items[i].preview_url +
						'\nAlbum: ' +data.tracks.items[i].album.name +
						'\n---------------------------';

					if (data.tracks.items[i].artists[0].name === 'Ace of Base') {
						fs.appendFile('log.txt', songInfo, (err) => {
							if (err) throw err;						
						});
						console.log(songInfo);
						i = limitNumber
					}
				}			
			}
			
			else {
				for (var i = 0; i < Object.keys(data.tracks.items).length; i++) {
					var songInfo = '\nSearch Item Number: ' + (i+1) +
						'\nArtist(s): ' + data.tracks.items[i].artists[0].name +
						'\nSong Title: ' + data.tracks.items[i].name +
						'\nPreview Link: ' + data.tracks.items[i].preview_url +
						'\nAlbum: ' +data.tracks.items[i].album.name +
						'\n---------------------------';

					fs.appendFile('log.txt', songInfo, (err) => {
						if (err) throw err;						
					});

					console.log(songInfo);
				}
			}
		}
	});
}

function movieCheck() {
	if (songOrMovie == undefined) {
		songOrMovie = 'Mr. Nobody';
	}

	var queryUrl = 'http://www.omdbapi.com/?t=' + songOrMovie + '&y=&plot=short&apikey=40e9cece';

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var bodyPath = JSON.parse(body);
			var movieInfo = '\nMovie Title: ' + bodyPath.Title +
				'\nRelease Year: ' + bodyPath.Year +
				'\nIMDB Rating: ' + bodyPath.imdbRating +
				'\nRotten Tomatoes Rating: ' + bodyPath.Ratings[1].Value +
				'\nCountry: ' + bodyPath.Country +
				'\nLanguage: ' + bodyPath.Language +
				'\nPlot: ' + bodyPath.Plot +
				'\nActors: ' + bodyPath.Actors +
				'\n---------------------------';
			
			fs.appendFile('log.txt', '\n' + movieInfo, (err) => {
				if (err) throw err;
			});

			console.log(movieInfo);
		}
	});
}

function doSays() {
	fs.readFile('random.txt', 'utf8', function(error, data) {

	// If the code experiences any errors it will log the error to the console.
	if (error) {
		return console.log(error);
	}

	// console.log(data);
	var dataArr = data.split(',');
	action = dataArr[0];
	songOrMovie = dataArr[1];

	//Infinite loop can be caused if 'do-what-it-says' is in the random.txt file
	coreCode();
	});
}

//node.js commands
function coreCode() {
	if (action === 'my-tweets') {
		myTweets(20)
	}

	else if (action === 'spotify-this-song') {
		spotifySong(1)
	}

	else if (action === 'movie-this') {
		movieCheck()
	}

	else if (action === 'do-what-it-says') {
		doSays()
	}
}

coreCode();