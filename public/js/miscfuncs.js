// Utility functions not used directly by app

// make color from slider
function rainbow(n) {
    var n = n * 240 / 255;
    return 'hsl(' + n + ',100%,50%)';
}

function colorBox(elid, inputhue) {
		var mybox = document.getElementById(elid)
		var mybox2d = mybox.getContext("2d");
		
		mybox2d.fillStyle = rainbow(inputhue);
		mybox2d.fillRect(0,0,100,100);
}

// randomize lat/lng input
function fuzzyInput(latlng) {
		var latsign = Math.sign(Math.random()-0.5);
		var lngsign = Math.sign(Math.random()-0.5);

		// global because they substitute for form element values
		window.jitter =  logInput("jitter",1,1000,0.0001,10000);
	  window.radius = logInput("radius",10,1000000,10,25000000);
		
		// generate jitter for lat/long, without exceeding the maximum distance of
		// radius meters from the point
		var offset = distFromLatLng(latlng, radius);

		var latjitter = latsign*Math.min(randomExponential(1/jitter), offset.lat)*Math.sqrt(2)/2;
		var lngjitter = lngsign*Math.min(randomExponential(1/jitter), offset.lng)*Math.sqrt(2)/2;

		var fuzzyLatLng = {lat: latlng.lat+latjitter, lng: latlng.lng+lngjitter};

		return fuzzyLatLng;
}

function logInput(elid,minp,maxp,minout,maxout) {
		// http://stackoverflow.com/a/846249/2023432
		var position = document.getElementById(elid).value
		// position will be between 0 and 100
		// var minp = 10;
		// var maxp = 1000000;
		
		// The result should be between 100 an 10000000
		var minv = Math.log(minout);
		var maxv = Math.log(maxout);
		
		// calculate adjustment factor
		var scale = (maxv-minv) / (maxp-minp);

		return Math.exp(minv + scale*(position-minp));
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

		var latoffset = meters/111111;
		var lngoffset = meters/(111111*Math.cos(latlng.lat*Math.PI/180));

		var offset = {lat: latoffset, lng: lngoffset};

		return offset;

}

// Math.sign for crappy browsers that don't support it
if (typeof(Math.sign) != "function") {
		Math.sign = function(x) {
				if( +x === x ) { // check if a number was given
						return (x === 0) ? x : (x > 0) ? 1 : -1;
				}
				return NaN;
		}
}
