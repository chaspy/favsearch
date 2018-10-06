require 'sinatra'
require 'twitter'
require 'omniauth'
require 'omniauth-twitter'
require 'sinatra/base'
require 'sinatra/reloader'

enable :sessions

# Twitter API initialization
before do
  @twitter = Twitter::REST::Client.new do |config|
    config.consumer_key        = YOUR_CONSUMER_KEY
    config.consumer_secret     = YOUR_CONSUMER_SECRET
    config.access_token        = nil
    config.access_token_secret = nil
  end
end

use Rack::Session::Cookie
use OmniAuth::Builder do
  provider :twitter, YOUR_CONSUMER_KEY, YOUR_CONSUMER_SECRET
end

get '/' do
  erb "<a href='/auth/twitter'>Login with Twitter</a><br>"
end

# Do Authentication
get '/auth' do
end

# return Access Token
get '/auth/:provider/callback' do
  p 'START CALLBACK'
  result = request.env['omniauth.auth']
  pp result.credentials
  @twitter.access_token = result.credentials.token
  @twitter.access_token_secret = result.credentials.secret
  result_fav = @twitter.favorites
  fav_tweets = []

  result_fav.each do |a|
    fav_tweets.push(a.text)
    puts a.text
  end

  erb "<a href='/'>Top</a><br>
       <h1>#{params[:provider]}</h1>
       <pre>#{JSON.pretty_generate(fav_tweets)}</pre>"
end
