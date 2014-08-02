////// things for interacting with the submitted data visually //////

// add sidebar
var FuzzyList = L.control.sidebar('fuzzylist', {
    closeButton: true,
    position: 'right'
});
map.addControl(FuzzyList);

