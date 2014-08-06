////// things for interacting with the submitted data visually //////

// add sidebar
var FuzzyList = L.control.sidebar('fuzzylist', {
    closeButton: true,
    position: 'right'
});
map.addControl(FuzzyList);


// button to display right list sidebar
listButton = new L.Control.Button(L.DomUtil.get('listbutton'), { toggleButton: 'active' });
listButton.addTo(map);
listButton.on('click', function () {
    if (menuButton.isToggled()) {
        FuzzyList.hide();
    } else {
        FuzzyList.show();
				document.getElementById("listpane").innerHTML = httpGet("/list");
    }
});


// populate map with circles as drawn from existing db entries
setTimeout(function () {
		// get data
		var mydata = JSON.parse(httpGet("/documents"));

		// iterate over entries to get lat, lng, and radius
		for (var i=0, tot=mydata.length; i < tot; i++) {
				// check to see if we have the necessary props
				if (mydata[i].hasOwnProperty("nym") &&
						mydata[i].hasOwnProperty("lat") &&
						mydata[i].hasOwnProperty("lng") &&
						mydata[i].hasOwnProperty("radius") &&
					  mydata[i].hasOwnProperty("color")) {
						// extract circles, props (TODO add color to submit)
			
						thislatlng = L.latLng(mydata[i].lat,mydata[i].lng);
						thisradius = mydata[i].radius;
						thisnym = mydata[i].nym;
						thiscolor = rainbow(mydata[i].color);

						// build circle
						thiscircle = L.circle(thislatlng, thisradius, {
								color: thiscolor,
								fillColor: thiscolor,
								fillOpacity: 0.25,
								weight: 2
						});
		
						// add to map
						thiscircle.bindLabel(thisnym).addTo(map);

						// make circle deletable with closure for scope
						(function (thiscircle) {
								thiscircle.addEventListener('click', function () {
										if (circledelete == true) {
												var delok = confirm("Delete this entry? This is permanent!");
												if (delok == true) {
														map.removeLayer(thiscircle);
														// get lat/lng of circle to do db lookup and delete
														var rmlatlng = thiscircle.getLatLng();
														
														// make a form quickly to submit the coords to delete 
														post_to_url("/remove/" + rmlatlng.lat + "/" + rmlatlng.lng, []);
												}
										}
								});
						})(thiscircle);
				}
		}
}, 600);

function cssAddClass (id, newclass) { 
		$( id ).addClass( newclass );
}

function cssDropClass (id, dropclass) {
		$( id ).removeClass ( dropclass );
}

// GETs and POSTs
// http://stackoverflow.com/a/4033310
function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function post_to_url(url, params) {
		// lol too easy with jQuery :\\\\
		$.post(url, params)

}
