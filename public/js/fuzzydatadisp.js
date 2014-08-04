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
				}
		}
}, 600);

// function to do GETs from within JS
// http://stackoverflow.com/a/4033310
function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
