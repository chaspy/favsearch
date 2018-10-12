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
    config.consumer_key        = ENV.fetch('YOUR_CONSUMER_KEY')
    config.consumer_secret     = ENV.fetch('YOUR_CONSUMER_SECRET')
    config.access_token        = nil
    config.access_token_secret = nil
  end
end

use Rack::Session::Cookie
use OmniAuth::Builder do
  provider :twitter, ENV.fetch('YOUR_CONSUMER_KEY'), ENV.fetch('YOUR_CONSUMER_SECRET')
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
  result_fav = @twitter.favorites(count: '200')
  fav_tweets = []

  result_fav.each do |a|
    fav_tweets.push(a.full_text)
  end

  erb "<a href='/'>Top</a><br>
       <h1>#{params[:provider]}</h1>
       <h2>Your fav count number: #{fav_tweets.count}</h2>
       <pre>#{JSON.pretty_generate(fav_tweets)}</pre>"
end
