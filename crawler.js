var config = require('./config.js');
var Twit = require('twit');
var db = require("mongojs").connect(
    config.MONGODB_DB_URL
  , config.MONGODB_COLLECTIONS
);

var twitter = new Twit({
    consumer_key:         config.CONSUMER_KEY
  , consumer_secret:      config.CONSUMER_SECRET
  , access_token:         config.ACCESS_TOKEN
  , access_token_secret:  config.ACCESS_TOKEN_SECRET
});

var area = [ '-180', '-90', '180', '90' ];
var stream = twitter.stream('statuses/filter', { locations: area });

stream.on('tweet', function (tweet) {
  if (tweet.geo != null && tweet.text != null && tweet.place != null && tweet.place.country_code != null) {
    db.tweets.save({
      text: tweet.text
    , geo:  tweet.geo
    , country: tweet.place.country_code
    }, function(err, saved) {
      if( err || !saved ) {
        console.log("Tweet not saved");
      }
    });
  }
});
