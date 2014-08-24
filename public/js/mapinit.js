///// Leaflet map stuff /////
//
// Create a map in the div #map
var map = L.map('map').setView([21.30694, 157.85833], 2);

// add an OpenStreetMap tile layer
var baseLayer = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | code &copy <a href="https://github.com/talexand/fuzzylocator">Team Pizza</a>',
		worldCopyJump: true
}).addTo(map);


var t = L.terminator({
		resolution: 2,
		weight: 1
});
t.addTo(map);

setInterval(function(){updateTerminator(t)}, 2000);
function updateTerminator(t) {
  var t2 = L.terminator();
  t.setLatLngs(t2.getLatLngs());
  t.redraw();
}
