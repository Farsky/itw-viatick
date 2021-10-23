var mapView;
var venue;
var search;
var analytics;

// For the demo animation
var polygonedLocations = [];

// Track which polygon belongs to which location
var locationsByPolygon = {};

var mapList = document.getElementById('mapList');
var mapsSortedByElevation = [];
var div = document.getElementById('mapView');
var mapExpanded = false;

// options for Mappedin.getVenue
// To get you started we've provided a key and secret that has access to some demo venues.
//  - mappedin-demo-mall
//  - mappedin-demo-retail-2
//  - warehouse-demo
//  - mappedin-demo-city
//  - rail-demo
//  - mappedin-demo-stadium
//  - mappedin-demo-entertainment-park
// Speak with a Mappedin representative when you are ready to get your own key and secret set up with access to your own venues.
// You may need to customize these options with the data provided by Mappedin for your venue.
var venueOptions = {
    clientId: '5f93249aa5fdf5001a6b9757',
    clientSecret: 'mpXGa2zgY1b0b8OhigR0oGlOZ08uT7vHrpIe9is5RMAyXEKL',
    perspective: 'Website',
    things: {
        venue: ['slug', 'name'],
        locations: ['name', 'type', 'description', 'icon', 'logo', 'sortOrder'],
        categories: ['name'],
        maps: ['name', 'elevation', 'shortName'],
    },
    venue: 'viatick-sands-grand-ballroom',
};

// Options for the MapView constructor
var mapviewOptions = {
    antialias: 'AUTO',
    mode: Mappedin.modes.TEST,
    onFirstMapLoaded: function () {
        console.log('First map fully loaded. No more pop in.');
    },
    onDataLoaded: function () {
        console.log(
            '3D data loaded, map usable. Could hide loading screen here, but things will be popping in. Now you can do things that interact with the 3D scene'
        );
        //onDataLoaded();
    },
};

// Options for search
var searchOptions = {
    key: '',
    secret: '',
};

// Combined all of them to use Mappedin.initalize
var options = {
    mapview: mapviewOptions,
    venue: venueOptions,
    search: searchOptions,
};

// This is your main function. It talks to the mappedin API and sets everything up for you
function initMappedin() {
    Mappedin.initialize(options, div).then(
        function (data) {
            mapView = data.mapview;
            venue = data.venue;
            search = data.search;
            analytics = data.analytics;

            authorization = data.venue._authorization;
            initLeaflet();
        },
        function (error) {
            window.alert('Mappedin ' + error);
        }
    );
}

// Start up the mapview
initMappedin();
