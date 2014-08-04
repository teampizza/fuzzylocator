require 'sinatra'
require 'mongo'
require 'json/ext'
require 'csv'
require 'builder'

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
header = ["_id", "color", "radius", "lat", "lng" , "nym", "contact"]

## insert entry
# insert a new document from the request parameters
# (then return the document--commented out for debug)
post '/submit' do
  content_type :json
  new_id = settings.mongo_db['testdb'].insert params
  # document_by_id(new_id)
end


## retrieve entries
# download a list of all documents in the collection
post '/csvlist' do
  content_type 'text/csv'

  csv_string = CSV.generate do |csv|
    csv << header # stick our known header on first
    # then iterate over each row
    JSON.parse(settings.mongo_db['testdb'].find.to_a.to_json).each do |entry|
      csv << entry.values
    end
  end

  csv_string #, :filename=> 'list.csv', :type=> 'text/csv'
end

# get a small HTML list of all documents for info pane
get '/list' do
  content_type :html
  
  hasharray_to_html(JSON.parse(settings.mongo_db['testdb'].find.to_a.to_json))
end

# print all documents as json
get '/documents' do
  content_type :json
  
  settings.mongo_db['testdb'].find.to_a.to_json
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
  db = settings.mongo_db['testdb']
  id = object_id(params[:id])
  if db.find_one(id)
    db.remove(:_id => id)
    {:success => true}.to_json
  else
    {:success => false}.to_json
  end
end


## overall view, for debugging only
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
    settings.mongo_db['testdb'].
      find_one(:_id => id).to_json
  end
end


## making tables from hashes for easy display
# http://stackoverflow.com/questions/2634024/generate-an-html-table-from-an-array-of-hashes-in-ruby

def hasharray_to_html( hashArray )
  # collect all hash keys, even if they don't appear in each hash
  # use array union to find all unique headers/keys
  headers = hashArray.inject([]){|a,x| a |= x.keys ; a}

  html = Builder::XmlMarkup.new(:indent => 2)
  html.table {
    html.tr { headers.each{|h| html.th(h)} }
    hashArray.each do |row|
      html.tr { row.values.each { |value| html.td(value) }}
    end
  }
  return html
end
