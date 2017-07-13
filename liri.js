var keyFile = require('./keys.js');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

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

// var movieTitle = //process.argv[3];

function myTweets(numberTweets) {
	var params = {screen_name: 'ucbe_rm'}; //This looks for the screen_name in twitter to see their tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			// console.log(tweets);
			// console.log('Date Tweeted', tweets[0].created_at);
			// console.log('Tweet', tweets[0].text);
			for (var i = 0; i < numberTweets; i++) {
				console.log('Date Created: ', tweets[i].created_at);
				console.log('Tweet: ', tweets[i].text);
			}
	 	}
	 	else if (error) {
			return console.log('Error occurred: ' + error);
		}
	});
}

function spotifySong(songTitle){
	var songTitle = process.argv[3];
	console.log(songTitle);
	if (process.argv[3] === undefined){
		songTitle = 'The Sign';
	}
	
	spotify.search({ type: 'track', query: songTitle, limit: 1 }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}

		else {
			// console.log(JSON.stringify(data, null, 2));
			// console.log('Artist(s): ', data[tracks[items[artists[name]]]]);
			// console.log('Song Title: ', data[tracks[items[name]]]);
			// console.log('Song Title: ', data[tracks][items][name]);
			console.log('Artist(s): ', data.tracks.items[0].artists[0].name);
			console.log('Song Title: ', data.tracks.items[0].name);
		}
	});
}

//node.js commands
if (action === 'my-tweets') {
	myTweets(20);
}

else if (action === 'spotify-this-song') {
	spotifySong(process.argv[3]);
}

