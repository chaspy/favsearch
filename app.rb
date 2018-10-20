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
  erb :index
end

# return Access Token
get '/auth/:provider/callback' do
  # Save session
  session[:uid] = env['omniauth.auth']['uid']
  session[:twitter_oauth] = env['omniauth.auth'][:credentials]

  redirect to('/')
end

get '/favorite' do
  @twitter.access_token = session[:twitter_oauth].token
  @twitter.access_token_secret = session[:twitter_oauth].secret
  result_fav = @twitter.favorites(count: '200')
  fav_tweets = []

  result_fav.each do |a|
    fav_tweets.push(a.full_text)
  end
  fav_tweets.to_json
end

helpers do
  def current_user
    # If logined, return true
    !session[:uid].nil?
  end
end
