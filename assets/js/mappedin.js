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

// This is your main function. It talks to the mappedin API and sets everything up for you
function initMappedin() {
    Mappedin.initialize({
        mapview: {
            antialias: 'AUTO',
            mode: Mappedin.modes.TEST,
            onFirstMapLoaded: function () {
                console.log('First map fully loaded. No more pop in.');
            },
            onDataLoaded: function () {
                console.log('3D data loaded, map usable. Could hide loading screen here, but things will be popping in. Now you can do things that interact with the 3D scene');
            },
        },
        venue: venueOptions,
        search: {
            key: '',
            secret: '',
        },
    }, div).then(
        function (data) {
            initLeaflet(data.venue._authorization);
        },
        function (error) {
            window.alert(`Mappedin failure: ${error}`);
        }
    );
}

// Start up the mapview
initMappedin();