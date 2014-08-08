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

// export map screenshot
document.getElementById("mapdl").addEventListener("click", function(){
		var opts = {
				lines: 11, // The number of lines to draw
				length: 40, // The length of each line
				width: 6, // The line thickness
				radius: 40, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#eee', // #rgb or #rrggbb or array of colors
				speed: 0.9, // Rounds per second
				trail: 43, // Afterglow percentage
				shadow: true, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex: 2e9, // The z-index (defaults to 2000000000)
				top: '50%', // Top position relative to parent
				left: '50%' // Left position relative to parent
		};
		var target = document.getElementById('map');
		
		// global so setTimeout can find it :/
		loading = new Spinner(opts).spin(target);
		// hacky thing because function returns but still takes time
		setTimeout('loading.stop();',7000);
		leafletImage(map, doImage);

		
});

function doImage(err, canvas) {
    var img = document.createElement('img');
    var dimensions = map.getSize();
    img.width = dimensions.x;
    img.height = dimensions.y;
    img.src = canvas.toDataURL();
		// http://stackoverflow.com/a/21915171/2023432
		var filename = "export.png";
		var imgexport = $('<a></a>', {
				"download": filename,
				"href": img.src,
				"id": "exportDataID"
		}).appendTo("body");
		imgexport[0].click();
		imgexport.remove();
		return;
}


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

// workaround to stop radio buttons from getting sucked into submit
$("#infoform").submit(function() {
  $(this).find(":radio, :checkbox").prop('disabled', true);
});
