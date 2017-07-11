var keyFile = require('./keys.js');
var Twitter = require('twitter');

var client = new Twitter({
	consumer_key: keyFile.twitterKeys.consumer_key,
	consumer_secret: keyFile.twitterKeys.consumer_secret,
	access_token_key: keyFile.twitterKeys.access_token_key,
	access_token_secret: keyFile.twitterKeys.access_token_secret
});
 
// console.log(keyFile.twitterKeys.consumer_key);
// console.log(keyFile.twitterKeys.consumer_secret);
// console.log(keyFile.twitterKeys.access_token_key);
// console.log(keyFile.twitterKeys.access_token_secret);

var params = {screen_name: 'ucbe_rm'}; //ucbe_rm was nodejs originally
client.get('statuses/user_timeline', params, function(error, tweets, response) {
	if (!error) {
		// console.log(tweets);
		console.log('Date Tweeted', tweets[0].created_at);
		console.log('Tweet', tweets[0].text);
  }
});