require 'sinatra'
require 'mongo'
require 'json/ext'
require 'csv'

# http://code.tutsplus.com/tutorials/singing-with-sinatra--net-18965
set :public_folder, 'public'

# mongo code from the sinatra recipe book
# http://recipes.sinatrarb.com/p/databases/mongo?#article
include Mongo

configure do
  conn = MongoClient.new("localhost", 27017)
  set :mongo_connection, conn
  set :mongo_db, conn.db('testdb')
end

# view page
get '/' do
  erb :fuzzylocator
end

##### DB stuff #####
header = ["_id", "radius", "jitter", "nym", "contact"]

## insert entry
# insert a new document from the request parameters,
# then return the full document
post '/submit' do
  content_type :json
  new_id = settings.mongo_db['test'].insert params
  document_by_id(new_id)
end


## retrieve entries
# download a list of all documents in the collection
post '/list' do
  content_type 'text/csv'

  csv_string = CSV.generate do |csv|
    csv << header # stick our known header on first
    # then iterate over each row
    JSON.parse(settings.mongo_db['test'].find.to_a.to_json).each do |entry|
      csv << entry.values
    end
  end

  csv_string #, :filename=> 'list.csv', :type=> 'text/csv'
end

# find a document by its ID
get '/document/:id/?' do
  content_type :json
  document_by_id(params[:id])
end


## delete entries
# delete the specified document and return success
delete '/remove/:id' do
  content_type :json
  db = settings.mongo_db['test']
  id = object_id(params[:id])
  if db.find_one(id)
    db.remove(:_id => id)
    {:success => true}.to_json
  else
    {:success => false}.to_json
  end
end


## overall view
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

