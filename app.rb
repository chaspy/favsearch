require 'sinatra'
require 'twitter'
require 'omniauth'
require 'omniauth-twitter'
require 'sinatra/base'
require 'sinatra/reloader'
require 'digest/sha2'

configure do
  use Rack::Session::Cookie,
      expire_after: 3600,
      secret: Digest::SHA256.hexdigest(rand.to_s)
end

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
  session[:twitter_oauth] = env['omniauth.auth'][:credentials]

  redirect to('/top')
end

get '/api/v1.0/favorite' do
  @twitter.access_token = session[:twitter_oauth].token
  @twitter.access_token_secret = session[:twitter_oauth].secret
  result_fav = []
  max_id = 0
  (1..5).each do |count|
    max_id == 0 ? fav = @twitter.favorites(count: '200') : fav = @twitter.favorites(count: '200', max_id: max_id)
    max_id = fav.last.id - 1
    result_fav = result_fav + fav
  end

  fav_tweets = []

  result_fav.each do |tw|
    hash = {
      id: tw.id,
      uri: tw.uri,
      text: tw.full_text,
      post_user_name: tw.user.name,
      post_user_screan_name: tw.user.screen_name,
      created_at: tw.created_at.getlocal("+09:00")
    }
    fav_tweets.push(hash)
  end
  fav_tweets.to_json
end

get '/top' do
  @DomainName = if request.port.nil? && ((request.port == '443') || (request.port == '80'))
                  request.scheme + '://' + request.host
                else
                  request.scheme + '://' + request.host + ':' + request.port.to_s
                end
  erb :favorite
end

def html(view)
  File.read(File.join('public', "#{view}.html"))
end
