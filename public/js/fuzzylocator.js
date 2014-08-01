///// Leaflet map stuff /////
//
// Create a map in the div #map
var map = L.map('map').setView([21.30694, 157.85833], 2);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add scale marker
L.control.scale().addTo(map);

// add sidebar
var FuzzyMenu = L.control.sidebar('fuzzymenu', {
    closeButton: true,
    position: 'left'
});
map.addControl(FuzzyMenu);

menuButton = new L.Control.Button(L.DomUtil.get('menubutton'), { toggleButton: 'active' });
menuButton.addTo(map);
menuButton.on('click', function () {
    if (menuButton.isToggled()) {
        FuzzyMenu.hide();
    } else {
        FuzzyMenu.show();
    }
});

// display menu on load
setTimeout(function () {
    FuzzyMenu.show();
}, 500);


// button actions
// download a map screenshot
document.getElementById("mapdl").addEventListener("click", function(){
		leafletImage(map, doImage);
});

function doImage(err, canvas) {
    var img = document.createElement('img');
    var dimensions = map.getSize();
    img.width = dimensions.x;
    img.height = dimensions.y;
    img.src = canvas.toDataURL();
    snapshot.innerHTML = '';
    snapshot.appendChild(img);
}

// download the posted info list as a TSV
document.getElementById("infodl").addEventListener("click", function(){


});

// enable drawing
var circleenabled = false;
drawcircle.onclick=function() {
    if (circleenabled == false) { circleenabled = true; }
    else { circleenabled = false;}
};

// draw circles on click
var mycircle;
// get info


map.on('click', function (e) {
    if (circleenabled == true) {
				// remove the existing circle if it has already been placed
				if (mycircle != undefined) {
						map.removeLayer(mycircle);
				};
				
				// export the latlng data to the window for other funcs
				window.latlng = e.latlng;
				
				var currenthue = rainbow(hueslider.value);
				mycircle = L.circle(e.latlng, radius.value, {
						color: currenthue,
						fillColor: currenthue,
						fillOpacity: 0.5,
						weight: 2
				});
				mycircle.bindLabel(document.getElementById("nym").value)
						.addTo(map);
    }
});

// make color from slider
function rainbow(n) {
    n = n * 240 / 255;
    return 'hsl(' + n + ',100%,50%)';
}

// info submit
