require 'rubygems'
require 'bundler/setup'

require 'sinatra'
require 'mongo'
require 'json/ext'
# require 'bson/ext' # for mongo
require 'csv' # list export
require 'builder' # needed for making tables from hashes

# http://code.tutsplus.com/tutorials/singing-with-sinatra--net-18965
set :public_folder, 'public'

# mongo code from the sinatra recipe book
# http://recipes.sinatrarb.com/p/databases/mongo?#article
include Mongo

configure do
  conn = MongoClient.new("localhost", 27017)
  set :mongo_connection, conn
  set :mongo_db, conn.db('testdb')

  # session suffix
  @@suffix = "testdb"
end


# view new/random page
get '/' do
  @@suffix = (randnonce(10))
  redirect '/p/' + @@suffix # 302 is automatic

  erb :fuzzylocator
end

# view specific page
get '/p/:page' do
  @@suffix = params[:page]

  erb :fuzzylocator
end

# empty URL etc
['/p/', '/p'].each do |route|
  get route do
    redirect '/'
  end
end

##### DB stuff #####
header = ["radius (m)", "lat", "lng" , "nym", "contact"] # export header

## insert entry (submit info)
# insert a new document from the request parameters
# (then return the document--commented out for debug)
post '/p/:params' do
  content_type :html

  # validation! check to make sure the lat/lng is valid
  if params[:lat].length > 0 and params[:lng].length > 0
    new_id = settings.mongo_db[@@suffix].insert params
  end

  # reload page for now, but would like to fix
  erb :fuzzylocator
end


## retrieve entries
# download a list of all documents in the collection
post '/csvlist' do
  content_type 'text/csv'

  csv_string = CSV.generate do |csv|
    csv << header # stick our known header on first
    # then iterate over each row
    JSON.parse(settings.mongo_db[@@suffix].find.to_a.to_json).each do |entry|
      # clean up entry for export
      entry = entry.keep_if do |key,val| 
        ["radius", "lat", "lng", "nym", "contact"].include?(key)
      end

      csv << entry.values
    end
  end

  csv_string #, :filename=> 'list.csv', :type=> 'text/csv'
end

# get a small HTML list of all documents for info pane
get '/list' do
  content_type :html
  
  myhash = JSON.parse(settings.mongo_db[@@suffix].find.to_a.to_json)
  myhash.each do |hash|
    # drop items irrelevant for presentation
    hash = hash.keep_if do |key,val| 
      ["radius", "lat", "lng", "nym", "contact"].include?(key)
    end

    # round off long decimals
    hash['lat'] = hash['lat'].to_f.round(4)
    hash['lng'] = hash['lng'].to_f.round(4)
  end

  hasharray_to_html(myhash)
end

# print all documents as json
# for populating circles on map
get '/documents' do
  content_type :json
  
  settings.mongo_db[@@suffix].find.to_a.to_json
end

## delete entries

# delete the specified entry by lat/lng
post '/remove/:lat/:lng' do
  content_type :json  
  db = settings.mongo_db[@@suffix]
  lat = params[:lat]
  lng = params[:lng]

  db.remove( { :$and => [ { :lat => lat}, { :lng => lng } ] } )
  
  erb :fuzzylocator
end
  
##### DEBUG ONLY ROUTES #####
## overall view, for debugging only
# get '/collections/?' do
#   content_type :json
#   settings.mongo_db.collection_names.to_json
# end

# find a document by its ID
# get '/document/:id/?' do
#   content_type :json
#   document_by_id(params[:id])
# end


##### HELPERS #####
helpers do
  # a helper method to turn a string ID
  # representation into a BSON::ObjectId
  # def object_id val
  #   BSON::ObjectId.from_string(val)
  # end
  # 
  # def document_by_id id
  #   id = object_id(id) if String === id
  #   settings.mongo_db[@@suffix].
  #     find_one(:_id => id).to_json
  # end

  def randnonce len
    # http://stackoverflow.com/a/3572953
    (36**(len-1) + rand(36**len)).to_s(36)
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

    return html.target!
  end
end




