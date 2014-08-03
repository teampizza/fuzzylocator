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
