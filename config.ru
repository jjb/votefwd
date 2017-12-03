require 'rack/jekyll'
require 'yaml'
run Rack::Jekyll.new

# enable compression
use Rack::Deflater
