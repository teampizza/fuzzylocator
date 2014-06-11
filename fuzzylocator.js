// Create a map in the div #map
var map = L.map('map').setView([21.30694, 157.85833], 2);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add scale marker
L.control.scale().addTo(map)

// add our menu
var FuzzyMenu = L.control.extend({
		options: {
				position: 'topright'
		},

		onAdd: function (map) {
        // create the control container with a particular class name
        var container = L.DomUtil.create('div', 'fuzzy-menu');

        // ... initialize other DOM elements, add listeners, etc.
				// var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-bar-part', container);
// var userIcon = L.DomUtil.create('i', 'fa fa-users fa-lg', this.link);
        var userIcon = L.DomUtil.create('img' , 'img-responsive' , this.link);
        userIcon.src = 'https://raw.githubusercontent.com/CliffCloud/Leaflet.LocationShare/master/dist/images/IconLocShare.png'
        this.link.href = '#';

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

		_click: function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
// TODO: get location and putout url
      placeMarker( this._map )
		}
});

map.addControl(new FuzzyMenu());
