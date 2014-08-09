

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


// enable drawing
var circleenabled = false;
// enable deleting
var circledelete = false;
$("[id='drawcircle']").click(function () {
		circledelete = false;
		cssDropClass("#map", "deletable");
    if (circleenabled == false) {
				circledelete = false; // disable deleting
				circleenabled = true;
				cssAddClass("#map", "drawable"); // change to tool cursor
		}
});
$("[id='delcircle']").click(function () {
		//		else if(document.getElementById("delcircle").checked) {
		circleenabled = false;
		cssDropClass("#map", "drawable"); // remove cursor style
		
		if (circledelete == false) { 
				circleenabled = false; // disable drawing
				circledelete = true;
				cssAddClass("#map", "deletable");
		}
});
$("[id='disabletool']").click(function () {
		//		else if(document.getElementById("disabletool").checked) {
		circledelete = false;
		circleenabled= false;
		cssDropClass("#map", "drawable"); // remove cursor style
		cssDropClass("#map", "deletable");
});

// download a map screenshot
document.getElementById("darkenbutton").addEventListener("click", function(){
		darkmode();
});

// draw circles on click
var mycircle; // TODO is this necessary?
map.on('click', function (e) {

		// for adding circles
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
						fillOpacity: 0.25,
						weight: 2
				});
				mycircle.bindLabel(document.getElementById("nym"), {
								direction: 'auto'
				}.value).addTo(map);

				// add to form for submission
				document.getElementById("formlat").value = window.latlng.lat;
				document.getElementById("formlng").value = window.latlng.lng;

				// make circle deletable (closure for scope)
				(function (mycircle) {
						mycircle.addEventListener( 'click', function () {
								
								if (circledelete == true) {
										var delok = confirm("Delete this entry? This will also delete the submitted record!");
										if (delok == true) {
												map.removeLayer(mycircle);
												// get lat/lng of circle to do db lookup and delete
												rmlatlng = mycircle.getLatLng();
												// make a form quickly to submit the coords to delete route
												post_to_url("/remove/" + rmlatlng.lat + "/" + rmlatlng.lng, []);
										}
								}
						});
				})(mycircle);
		}														 
});

// make color from slider
function rainbow(n) {
    n = n * 240 / 255;
    return 'hsl(' + n + ',100%,50%)';
}

// darken interface
var isdark = false;
function darkmode() {

		if (isdark == false) {
				isdark = true;
				
				// load CSS
				$('head').append('<link rel="stylesheet" href="/css/dark.css" type="text/css" />');

				// change tile colors
				baseLayer.setFilter(function () {
						new L.CanvasFilter(this, {
								channelFilter: function (imageData) {
										return new L.CanvasChannelFilters.Invert(imageData, {
												//                values: [100, 100]
										}).render();
								}
						}).render();
				});
				
		}

		else if (isdark == true) {
				isdark = false;

				// unload CSS
				$("link[href='/css/dark.css']").remove();

				// change tile colors back
				baseLayer.setFilter(function () {
						L.ImageFilters.Presets.CSS.None;
				});
		}
}

// randomize lat/lng input
function fuzzyinput(latlng) {
		latsign = Math.sign(Math.random()-0.5);
		lngsign = Math.sign(Math.random()-0.5);

		jitter = document.getElementById("jitter").value;
		radius = document.getElementById("radius").value;
		
		// generate jitter for lat/long, without exceeding the maximum distance of
		// radius meters from the point
		offset = distFromLatLng(latlng, radius);
		
		// console.log("offset: ", offset);

		latjitter = latsign*Math.min(randomExponential(1/jitter), offset.lat)*Math.sqrt(2)/2;
		lngjitter = lngsign*Math.min(randomExponential(1/jitter), offset.lng)*Math.sqrt(2)/2;

		fuzzyLatLng = {lat: latlng.lat+latjitter, lng: latlng.lng+lngjitter};

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


function distFromLatLng(latlng, meters) {
		// computes lat/long offset from given meter offset
		// using pure spherical approximation

		latoffset = meters/111111;
		lngoffset = meters/(111111)*Math.cos(latlng.lat);

		offset = {lat: latoffset, lng: lngoffset};

		return offset;

}

