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
  'hello, favsearch'
end
