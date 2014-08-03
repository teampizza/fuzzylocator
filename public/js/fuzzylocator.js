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

// button to display right list sidebar
listButton = new L.Control.Button(L.DomUtil.get('listbutton'), { toggleButton: 'active' });
listButton.addTo(map);
listButton.on('click', function () {
    if (menuButton.isToggled()) {
        FuzzyList.hide();
    } else {
        FuzzyList.show();
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
				window.latlng = fuzzyinput(e.latlng);
				
				var currenthue = rainbow(hueslider.value);
				mycircle = L.circle(window.latlng, radius, {
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

// randomize lat/lng input
function fuzzyinput(latlng) {
		latsign = Math.sign(Math.random()-0.5);
		lngsign = Math.sign(Math.random()-0.5);

		jitter = document.getElementById("jitter").value;
		radius = document.getElementById("radius").value;

		latjitter = latsign*Math.min(randomExponential(1/jitter), radius)*Math.sqrt(2)/2;
		lngjitter = lngsign*Math.min(randomExponential(1/jitter),radius)*Math.sqrt(2)/2;

		console.log(latlng);

		console.log(latjitter);
		console.log(lngjitter);

		fuzzyLatLng = L.latLng(latlng.lat+latjitter,latlng.lng+lngjitter);
		
		console.log(fuzzyLatLng);

		return fuzzyLatLng;
}

// make random exponential numbers
// Exponential random number generator
// Time until next arrival
function randomExponential(rate, randomUniform) {
		// http://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
		rate = rate || 1;
		
		// Allow to pass a random uniform value or function
		// Default to Math.random()
		var U = randomUniform;
		if (typeof randomUniform === 'function') U = randomUniform();
		if (!U) U = Math.random();
		
		return -Math.log(U)/rate;
}
