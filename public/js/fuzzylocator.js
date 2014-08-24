/***** CONTROLS/MENUS *****/

// add scale marker
L.control.scale().addTo(map);

// add sidebar
var FuzzyMenu = L.control.sidebar('fuzzymenu', {
    closeButton: true,
    position: 'left'
});
map.addControl(FuzzyMenu);

menuButton = new L.Control.Button(L.DomUtil.get('menubutton'), { 
		toggleButton: 'active' });
menuButton.addTo(map);
menuButton.on('click', function () {
    if (menuButton.isToggled()) {
        FuzzyMenu.hide();
    } else {
        FuzzyMenu.show();
    }
});

lightButton = new L.Control.Button(L.DomUtil.get('darkenbutton'), {
		toggleButton: 'active' });
setTimeout(function () { // hack to put it on bottom of stack
		lightButton.addTo(map);
}, 500);
lightButton.on('click', function () {
		darkmode();
});

termButton = new L.Control.Button(L.DomUtil.get('termbutton'), {
		toggleButton: 'active' });
setTimeout(function () { // hack to put it on bottom of stack
		termButton.addTo(map);
}, 500);
termButton.on('click', function () {
		termmode();
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
				window.latlng = fuzzyInput(e.latlng);
				
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
				document.getElementById("formrad").value = radius;

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

				// unload dark CSS
				$("link[href='/css/dark.css']").remove();

				// change tile colors back
				baseLayer.setFilter(function () {
						L.ImageFilters.Presets.CSS.None;
				});
		}
}

// darken interface
var isterm = true;
function termmode() {
		
		if (isterm == false) {
				isterm = true;

				t.addTo(map);
		}

		else if (isterm == true) {
				isterm = false;
				
				map.removeLayer(t);
		}

}				
