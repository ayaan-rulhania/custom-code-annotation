#!/usr/bin/env ruby
require 'sinatra'
require 'json'
require_relative 'annotator'

set :bind, '0.0.0.0'
set :port, 4567

before do
  content_type 'application/json'
end

post '/api/annotate' do
  payload = JSON.parse(request.body.read)
  file = payload['file'] || ''
  keywords = payload['keywords'] || []
  style = payload['style'] || 'inline'
  annotated = Annotator.annotate(file, keywords, style)
  { annotated: annotated }.to_json
end

post '/api/generate_script' do
  payload = JSON.parse(request.body.read)
  keywords = payload['keywords'] || []
  style = payload['style'] || 'inline'
  language = payload['language'] || 'ruby'

  if language != 'ruby'
    status 400
    return { error: 'Only ruby script generation is supported' }.to_json
  end

  script = Annotator.generate_ruby_script(keywords, style)
  content_type 'text/plain'
  attachment 'annotator.rb'
  script
end

