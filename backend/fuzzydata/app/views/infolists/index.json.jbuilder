json.array!(@infolists) do |infolist|
  json.extract! infolist, :id, :nonce, :nym, :contact, :lat, :long, :radius
  json.url infolist_url(infolist, format: :json)
end
