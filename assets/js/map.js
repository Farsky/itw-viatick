ViatickMap = (function (Mappedin, L) {
    // Configure your map here
    const venueOptions = {
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

    let oAuthToken;

    const mapMarkerIcons = {
        activeExit: L.icon({
            className: 'exit-marker',
            iconAnchor: [12, 31],
            iconUrl: '/images/green-pin.svg',
        }),
        inactiveExit: L.icon({
            className: 'exit-marker',
            iconAnchor: [12, 31],
            iconUrl: '/images/red-pin.svg',
        }),
        safeZone: L.icon({
            className: 'zone-marker',
            iconUrl: '/images/black-dot.png',
        }),
        unsafeZone: L.icon({
            className: 'zone-marker',
            iconUrl: '/images/red-dot.png',
        }),
    };

    class ExitEntrance {
        id;
        name;
        x;
        y;
        adjacentLocationIds;

        #isDisabled;
        #marker;

        constructor(id, name, x, y, adjacentLocationIds = []) {
            this.id = id;
            this.name = name;
            this.x = x;
            this.y = y;
            this.adjacentLocationIds = adjacentLocationIds;

            this.#isDisabled = false;

            // Get marker's relative position (based on map zoom level)
            let maxZoom = leaflet.map.getMaxZoom();
            let latlng = leaflet.map.unproject([x, y], maxZoom);
            this.#marker = L.marker(latlng, {
                icon: mapMarkerIcons.activeExit,
                zIndexOffset: 100,
            });

            // Add tooltip to show exit' name
            let tooltip = L.tooltip({
                direction: 'top',
                interactive: true,
            });
            tooltip.setContent(name);
            this.#marker.bindTooltip(tooltip);
        }

        isDisabled() {
            return this.#isDisabled;
        }
        setActive(isActive) {
            this.#isDisabled = !isActive;
            this.#marker.setIcon(!isActive ? mapMarkerIcons.inactiveExit : mapMarkerIcons.activeExit);
        }
        marker() {
            return this.#marker;
        }
    }

    class Location {
        locationId;
        locationName;
        nodeId;
        hasEscapeRoute;
        x;
        y;

        #isOnFire;
        #marker;

        constructor(id, name, node, hasEscapeRoute, x, y) {
            this.locationId = id;
            this.locationName = name;
            this.nodeId = node;
            this.hasEscapeRoute = hasEscapeRoute;
            this.x = x;
            this.y = y;

            this.#isOnFire = false;

            // Get marker's relative position (based on map zoom level)
            let maxZoom = leaflet.map.getMaxZoom();
            let latlng = leaflet.map.unproject(projective.transform([x, y]), maxZoom);
            this.#marker = L.marker(latlng, {
                icon: mapMarkerIcons.safeZone,
                zIndexOffset: 100,
            });

            // Add tooltip to show exit' name
            let tooltip = L.tooltip({
                className: 'zone-tooltip',
                direction: 'center',
                interactive: true,
                permanent: true,
            });
            tooltip.setContent(name);
            this.#marker.bindTooltip(tooltip);
        }

        isOnFire() {
            return this.#isOnFire;
        }
        toggleFireIndicator(isOnFire) {
            this.#isOnFire = isOnFire;
            this.#marker.setIcon(isOnFire ? mapMarkerIcons.unsafeZone : mapMarkerIcons.safeZone);
        }
        marker() {
            return this.#marker;
        }
    }

    // We will be using MappedIn API V1
    var host = {
        auth: 'https://auth.mappedin.com',
        api: 'https://api.mappedin.com/1/',
    };

    // We will be using the Leaflet (http://leafletjs.com/) map library to render the MappedIn Map and data.
    // You are free to choose any other Map Rendering library for your web based projects
    var leaflet = {
        map: null,
        layers: {},
        maxBounds: null,
    };

    // We will be rendering the 'MappedIn Mall' venue for this demo
    var venueId = 'viatick-sands-grand-ballroom';

    var projective;
    var map = null;
    var perspective;
    var cache = {
        nodeById: {},
        locations: [],
        enhancedLocations: [],
        exits: [],
        zones: [],
    };

    var escapeRoute = null;

    function getExits() {
        return new Promise((resolve, reject) => {
            let httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        // Parse the content to JSON
                        const exits = JSON.parse(httpRequest.responseText);

                        // Store exits in cache 
                        exits.forEach(exit => {
                            const adjacentLocationIds = exit.adjacentLocationIds.split(',');
                            cache.exits.push(new ExitEntrance(exit.exitId, exit.name, exit.x, exit.y, adjacentLocationIds));
                        });

                        resolve();
                    } else {
                        console.error(`Status code ${httpRequest.status}: ${httpRequest.responseText}`);
                        reject();
                    }
                }
            };

            httpRequest.onerror = () => reject();
            httpRequest.open('GET', '/api/exits');
            httpRequest.send();
        });
    }

    function getLocations() {
        return new Promise((resolve, reject) => {
            let httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        cache.zones = JSON.parse(httpRequest.responseText);
                        resolve();
                    } else {
                        console.error(`Status code ${httpRequest.status}: ${httpRequest.responseText}`);
                        reject();
                    }
                }
            };

            httpRequest.onerror = () => reject();
            httpRequest.open('GET', '/api/locations');
            httpRequest.send();
        });
    }

    // Auth
    /**
     * Our authentication function for requesting an OAuth token from the MappedIn server.
     * We will need this token for requesting any data from our API.
     *
     * Note: A MappedIn token expires after 24 hours. You should setup your code in your production
     * environment to be able to renew or request a new token before it expires
     **/
    function authenticate(grant, cb) {
        $.ajax({
            url: host.auth + '/oauth2/token',
            data: grant,
            type: 'POST',
            success: function (result) {
                token = result;
                cb();
            },
            error: function (result) {
                console.log('Error Authenticating.');
            },
        });
    }

    // Our main API object for requesting data from MappedIn
    var mappedinApi = {
        /**
         * A simple jQuery AJAX call to request the various type of data that the MappedIn web API is able to provide
         * Please consult the MappedIn API Reference doc at https://github.com/MappedIn/platform-api/blob/master/v1.md
         * for more information on the different parameters and calls you are allowed to make using the MappedIn API
         **/
        Get: function (asset, data, cb) {
            $.ajax({
                url: host.api + asset,
                data: data,
                type: 'GET',
                // Remember to include the OAuth token with every API request with MappedIn servers
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', oAuthToken);
                },
                success: cb,
            });
        },
    };

    /**
     * Simple initialization function to get the map data for our current venue and start the map loading process
     **/
    function init(venueId, cb) {
        mappedinApi.Get('map', { venue: venueId }, function (maps) {
            // Getting the first map returned by MappedIn API
            map = maps[0];

            // Getting the first perspective that belongs to this map
            perspective = map.perspectives[0];

            // Initializing the leaflet map
            initProjective(perspective);
            initMap(perspective.tiles || perspective.image);
            cb();
        });
    }

    /**
     * This is our main function for initializing the Leaflet map.
     * Here we tell Leaflet the URL for the map tiles to load and display.
     * We also tell Leaflet how much it should allow a user to scroll and pan the map.
     *
     * NOTE: As previously mentioned, you can use MappedIn API with any other map library that can display
     * custom map tiles. Using Leaflet in your web projects is not required to be able to use MappedIn API.
     **/
    function initMap(tiles) {
        // Prepare tiles URL for use in Leaflet
        var url =
            tiles +
            (tiles.substr(tiles.length - 1, 1) !== '/' ? '/' : '') +
            '{z}/{x}_{y}.png';

        // Here we are calculating the maximum zoom level available for our currently select map perspective.
        // The maximum zoom level is same as the maximum tile layer {z} available from our servers.
        var maxZoom =
            Math.ceil(
                Math.log(
                    Math.max(
                        perspective.size.height,
                        perspective.size.width
                    )
                ) / Math.log(2)
            ) - 8;

        // Setting up the Leaflet map layers
        leaflet.map = L.map('map', {
            crs: L.CRS.Simple,
            zoom: 2,
            minZoom: 0,
            maxZoom: maxZoom,
            center: [0, 0],
        }).addLayer(
            new L.tileLayer(url, {
                zoomOffset: 8,
                zoom: 0,
                minZoom: 0,
                maxZoom: maxZoom,
                noWrap: true,
                continuousWorld: true,
            })
        );

        // Setting up the max bounds for the map since our venue is not as bug as the world
        leaflet.maxBounds = getMaxBounds();
        leaflet.map.setMaxBounds(leaflet.maxBounds);
    }

    /**
     * Here we are creating a matrix for doing projective transformation calculations using the
     * Projective object from the Projective.js file.
     *
     * Matrix transformation are needed when the venue map you want to display in your web page has been
     * transformed, like rotated, skewed or resized in MappedIn Portal. When this occurs, all node data
     * returned from the server also has to be transformed to properly match the co-ordinates on the
     * transformed map, since the server by default will return data for the base map only.
     **/
    function initProjective(perspective) {
        var control = [],
            target = [];
        perspective.reference.forEach(function (pr) {
            control.push([
                parseFloat(pr.control.x),
                parseFloat(pr.control.y),
            ]);
            target.push([
                parseFloat(pr.target.x),
                parseFloat(pr.target.y),
            ]);
        });
        projective = new Projective({ from: control, to: target });
    }

    /**
     * Here we are getting all the data necessary to make our demo map work properly.
     * We are getting all locations and nodes that belong in this venue, and caching them in our 'cache' object.
     * We are also getting the different categories available for this venue and building a radio button list
     * to show how to display markers on the map for different types of locations.
     **/
    function getModelData(cb) {
        // Getting all locations for our venue.
        // You can also get all the location with the node objects inserted within my by passing 'embed' parameter like so:
        // mappedinApi.Get('location', { venue: venueId, embed: 'nodes' }, function (locations) { ... });
        mappedinApi.Get('location', { venue: venueId }, function (locations) {
            // Getting all nodes that belong to our currently selected map
            mappedinApi.Get('node', { map: map.id }, function (nodes) {
                // Getting all categories that have been defined for this venue in the MappedIn portal
                mappedinApi.Get('category', { venue: venueId }, function (categories) {
                    // Creating a hash table of all of our nodes in our cache
                    for (var i = 0; i < nodes.length; i++) {
                        cache.nodeById[nodes[i].id] = nodes[i];
                    }

                    // Dynamically creating a radio button list for you to switch between different
                    // category marker layers in Leaflet
                    var poiDiv = $('#poi-list');
                    for (var i = 0; i < categories.length; i++) {
                        var radio = $('<input/>', {
                            type: 'radio',
                            name: 'category',
                            value: categories[i].id,
                        });

                        // Setting the onChange listener on the radio buttons to switch between the different Leaflet layers
                        radio.on('change', function (e) {
                            changeCategoryById($(this).val());
                        });

                        var label = $('<label/>', { html: radio })
                            .append(categories[i].name)
                            .append('<br>');
                        poiDiv.append(label);
                    }

                    // Necessary data to draw escape routes
                    cache.enhancedLocations = [];
                    locations.forEach(location => {
                        let nodeId = location.nodes.length > 0 ? location.nodes[0].node : null;
                        let x = null,
                            y = null;

                        if (nodeId !== null) {
                            let node = cache.nodeById[nodeId];
                            if (node !== undefined) {
                                x = node.x;
                                y = node.y;
                            }
                        }

                        cache.enhancedLocations.push(new Location(location.id
                            , location.name
                            , nodeId
                            , nodeId !== null && cache.zones.some(zone => { return zone.locationId === location.id; })
                            , x
                            , y));
                    });

                    return cb();
                }
                );
            });
        });
    }

    /**
     * This function contains sample code to show how to setup click events on a Leaflet map and markers.
     **/
    function initMapInteraction() {
        // Hooking a click event on the map that displays an alert with the click's transformed co-ordinate
        // Same co-ordinate that is used by the nodes
        leaflet.map.on('click', function (e) {
            var pos = leaflet.map.project(
                e.latlng,
                leaflet.map.getMaxZoom()
            );
            alert('You clicked at co-ordinate ' + pos.x + ', ' + pos.y);
        });

        // Setting click events on all the markers to display an alert containing their location's name
        for (category in leaflet.layers) {
            for (mId in leaflet.layers[category].getLayers()) {
                var marker = leaflet.layers[category].getLayers()[mId];
                marker.on('click', function (e) {
                    var pos = leaflet.map.project(
                        e.latlng,
                        leaflet.map.getMaxZoom()
                    );
                    alert(
                        'You clicked on the ' +
                        this.location.name +
                        ' marker \n' +
                        'Located at co-ordinate ' +
                        pos.x.toFixed(2) +
                        ', ' +
                        pos.y.toFixed(2)
                    );
                });
            }
        }
    }

    /**
     * Function to quickly switch between different category marker layers in Leaflet
     **/
    function changeCategoryById(id) {
        // Hide all category layers from the map
        Object.keys(leaflet.layers).forEach(function (layer) {
            leaflet.map.removeLayer(leaflet.layers[layer]);
        });

        // Just show the currently provided category (id) layer on the map
        leaflet.map.addLayer(leaflet.layers[id]);
    }

    /**
     * A simple implementation that shows how to transform direction path co-ordinates and
     * then draw a path in Leaflet to show directions from the 'start' node to the 'end' node
     **/
    function drawDirections(venueId, start, end) {
        // Calling API to get the direction from 'start' to 'end' nodes
        mappedinApi.Get('directions', {
            venue: venueId,
            origin: start,
            destination: end,
        }, function (directions) {
            var path = [];

            // Processing all the nodes for the 'path' of the directions object into
            // co-ordinates that can be used by Leaflet to draw a directions line on the map
            for (var i = 0; i < directions.path.length; i++) {
                var coords = projective.transform([
                    directions.path[i].x,
                    directions.path[i].y,
                ]);
                var latlng = leaflet.map.unproject(
                    coords,
                    leaflet.map.getMaxZoom()
                );
                path.push(latlng);
            }

            // Making Leaflet draw a red lines showing the path to take from
            // the 'start' node to the 'end' node
            if (escapeRoute !== null) {
                leaflet.map.removeLayer(escapeRoute);
            }

            escapeRoute = new L.polyline(path, {
                color: 'blue',
                dashArray: '1 8',
                opacity: 0.7,
            });
            leaflet.map.addLayer(escapeRoute);
        }
        );
    }

    /**
     * Simple utility function to calculate the maximum scroll bounds for our map so Leaflet
     * does not scroll outside the map bounds
     **/
    function getMaxBounds() {
        var southWest = leaflet.map.unproject(
            [0, perspective.size.height],
            leaflet.map.getMaxZoom()
        );
        var northEast = leaflet.map.unproject(
            [perspective.size.width, 0],
            leaflet.map.getMaxZoom()
        );
        return new L.LatLngBounds(southWest, northEast);
    }

    function initExitMarkers() {
        cache.exits.forEach(location => {
            leaflet.map.addLayer(location.marker());
        });
    }

    function initZoneMarkers() {
        cache.enhancedLocations.forEach(location => {
            if (cache.zones.some(zone => { return zone.locationId === location.locationId; })
                && location.x !== null && location.y !== null) {
                leaflet.map.addLayer(location.marker());
            }
        });
    }

    function initLeaflet(token) {
        oAuthToken = token;

        // Authenticate with the API keys with the MappedIn server
        // Initialize the Leaflet map and start loading the map tiles for our venue
        init(venueId, function () {
            // Building our location, nodes and category data cache
            getModelData(function () {
                const getExitsPromise = getExits();
                const getLocationsPromise = getLocations();
                Promise.all([getExitsPromise, getLocationsPromise]).then(() => {
                    // Init markers for floor exits and zones
                    initExitMarkers();
                    initZoneMarkers();

                    // Initializing map click event related code
                    //initMapInteraction();
                });
            });
        });
    }

    // Create a div for Mappedin to load, but do not add it to the HTML body
    const mappedinContainer = document.createElement('div');

    // This is your main function. It talks to the mappedin API and sets everything up for you
    function initViatickMap() {
        Mappedin
            // I was lazy to extract authentication code from Mappedin, therefore I had to call Mappedin.initialize() to get the authentication token
            .initialize({
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
            }, mappedinContainer)
            .then(
                function (data) {
                    mappedinContainer.remove();

                    // Pass the token into callback to render the map using Leaflet
                    initLeaflet(data.venue._authorization);
                },
                function (error) {
                    mappedinContainer.remove();
                    window.alert(`Mappedin failure: ${error}`);
                }
            );
    }

    // Start up the mapview
    initViatickMap();

    return {
        // Drawing directions to and from 2 selected nodes in our cache
        drawEscapeRoute: function (locationName) {
            let startLocation;
            cache.enhancedLocations.forEach(location => {
                if (location.locationName === locationName) {
                    startLocation = location;
                }
            });

            if (startLocation === undefined) {
                console.error(`Location ${locationId} not found.`);
            }

            if (!startLocation.hasEscapeRoute) {
                console.error(`Location ${locationId} does not have an escape route.`);
            }

            // Calculate the distance from current location to all exits
            let escapeRoutes = [];
            cache.exits.forEach(exit => {
                if (exit.isDisabled()) return;

                exit.adjacentLocationIds.forEach(locationId => {
                    let location;
                    cache.enhancedLocations.forEach(enhancedLocation => {
                        if (enhancedLocation.locationId === locationId) {
                            location = enhancedLocation;
                        }
                    });

                    if (location === undefined) return;

                    // Calculate distance using hypotenuse formula
                    // More info: https://www.omnicalculator.com/math/hypotenuse
                    let diffX = startLocation.x - location.x;
                    let diffY = startLocation.y - location.y;
                    let distance = Math.sqrt(diffX * diffX + diffY * diffY);

                    escapeRoutes.push({
                        nodeId: location.nodeId,
                        distance: distance,
                    });
                });
            });

            if (escapeRoutes.length > 0) {
                // Sort escape routes by distance
                escapeRoutes.sort((a, b) => {
                    return a.distance < b.distance ? -1 : 1;
                });

                // Draw the shortest route
                drawDirections(venueId, startLocation.nodeId, escapeRoutes[0].nodeId);
            }
        },
        // Clear showing escape route
        clearEscapeRoute() {
            if (escapeRoute !== undefined && escapeRoute !== null) {
                leaflet.map.removeLayer(escapeRoute);
            }
        },
        // Enable/disable an exit
        toggleExit: function (name, isActive) {
            cache.exits.forEach(exit => {
                if (exit.name !== name) return;

                // I am lazy to check Boolean, therefore I use this trick to determine Boolean state
                if (isActive !== undefined) {
                    exit.setActive(!!isActive);
                } else {
                    exit.setActive(exit.isDisabled());
                }
            });
        },
        // Set the fire condition of a location
        toggleLocation: function (name, isOnFire) {
            cache.enhancedLocations.forEach(location => {
                if (location.locationName !== name) return;

                // I am lazy to check Boolean, therefore I use this trick to determine Boolean state
                if (isOnFire !== undefined) {
                    location.toggleFireIndicator(!!isOnFire);
                } else {
                    location.toggleFireIndicator(!location.isOnFire());
                }


            });
        }
    };
})(Mappedin, L);