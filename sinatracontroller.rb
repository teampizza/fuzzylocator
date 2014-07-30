require 'sinatra'
require 'mongo'
require 'json/ext'

set :public_folder, 'public'

# mongo code from the sinatra recipe book
# http://recipes.sinatrarb.com/p/databases/mongo?#article
include Mongo

configure do
  conn = MongoClient.new("localhost", 27017)
  set :mongo_connection, conn
  set :mongo_db, conn.db('testdb')
end

get '/' do
  erb :fuzzylocator
end

post 'submit' do
  
end

# what does this do?
get '/collections/?' do
  content_type :json
  settings.mongo_db.collection_names.to_json
end

helpers do
  # a helper method to turn a string ID
  # representation into a BSON::ObjectId
  def object_id val
    BSON::ObjectId.from_string(val)
  end

  def document_by_id id
    id = object_id(id) if String === id
    settings.mongo_db['test'].
      find_one(:_id => id).to_json
  end
end

