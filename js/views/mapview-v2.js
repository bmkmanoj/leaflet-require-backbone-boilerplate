define([
    'jquery',
    'underscore',
    'backbone',
    'leaflet',
    'markercluster',
    'collections/collection',
    'leaflet-search',
    'leaflet-control-locate',
    'text!templates/map.html'
], function($, _, Backbone, L, markercluster, mapCollection, leafletSearch, leafletLocate, mapTemplate) {

    var MapView = Backbone.View.extend({
        el: '#map',
        template: _.template(mapTemplate),
        initialize: function() {
            var map;
            //var collectiontemp = this.collection;
            this.collection = new mapCollection();
            this.collection.bind("reset", function() {
                this.render();
            }, this);
        },
        updateMap: function(e) {

            if (!e) { //createmap
                var temp = new L.LatLng(e.get('lat'), e.get('lng'));
                map.panTo(temp);
                //console.log("Manoj inside IF");
            } else {
                var temp = new L.LatLng(e.get('lat'), e.get('lng'));
                map.panTo(temp).setZoom(5);
                //new L.map('map_canvas').setView( new L.LatLng(e.get('lat'), e.get('lng') ), 8);
            }
        },
        render: function() {
            this.$el.html(this.template);

            var placeModels = {
                data: this.collection.models
            }

            var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
                thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>';

            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                osmAttrib = '&copy; ' + osmLink + ' Contributors',
                landUrl = 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
                thunAttrib = '&copy; ' + osmLink + ' Contributors & ' + thunLink;

            var osmMap = L.tileLayer(osmUrl, {
                    attribution: osmAttrib
                }),
                landMap = L.tileLayer(landUrl, {
                    attribution: thunAttrib
                });


            var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                }),
                latlng = L.latLng(0, 0);

            map = L.map('map_canvas', {
                center: latlng,
                zoom: 2,
                layers: [osmMap]
            });

            var baseLayers = {
                "OSM Mapnik": osmMap,
                "Landscape": landMap
            };
            /*var geocoder = L.Control.Geocoder.nominatim();
               // geocoder = L.Control.Geocoder.nominatim(),
                var control = L.Control.geocoder({
                    geocoder: geocoder
                }).addTo(map);*/
            //console.log(JSON.stringify(mapCollection));
            map.addControl(new L.Control.Search({
                url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
                jsonpParam: 'json_callback',
                propertyName: 'display_name',
                propertyLoc: ['lat', 'lon'],
                circleLocation: false,
                markerLocation: false,
                autoType: false,
                autoCollapse: true,
                minLength: 2,
                zoom: 10
            }));
            lc = L.control.locate({
                follow: true,
                strings: {
                    title: "Show me where I am !"
                }
            }).addTo(map);

            //var count = [17, 10, 14, 23, 12, 6];
            //var cities = ["New York City", "London", "Sidney", "Tokyo", "Sao Paulo", "Hyderabad"];
            var overlayMaps = {};
            var markers = {};
            var categoriesMeta; //= {},
            var markersCategory = {};
            var leafletMeta; // = {};
            var categories = {
                'active': new L.layerGroup().addTo(map),
                'inactive': new L.layerGroup().addTo(map)
            };

            for (var index in categories) {
                markersCategory[index] = [];
                overlayMaps[index] = categories[index];
            }

            markers = L.markerClusterGroup({
                spiderfyOnMaxZoom: true,
                zoomToBoundsOnClick: false
            });

            (function() {

                _.each(placeModels.data, function(places) {
                    //markers = {};
                    categoriesMeta = {};
                    leafletMeta = {};

                    var i = 0;
                    while (i < places.get("count")) {

                        var title = places.get("name");
                        var marker = L.marker(new L.LatLng(places.get("lat"), places.get("lng")), {
                            title: title
                        });
                        marker.bindPopup(title);

                        if (i < places.get("active")) {
                            markersCategory["active"].push(marker);
                        } else {
                            markersCategory["inactive"].push(marker);
                        }

                        markers.addLayer(marker);
                        i++;
                    }

                    //overlayMaps[cities[j]] = markers;

                    (function(k, placeName) {
                        markers.on('clusterclick', function(e) {

                            var data = "whatever";
                            //TODO change cluster click count according to the Layer
                            var popupContent = "<b><div class='numberCircle'>" + k + "</div><br /><a href='places/test/" + "' target='_blank'>" + "Sr. Directors of Marketing" + "</a></b><br />Highest Strategic & Innovation performers globally" + "<hr> Competency Cloud " +
                                " | " +
                                " &rarr; <i><a href='comptencycloud" + "id" + "' target='_blank'>" + placeName + "</a></i>";
                            //marker.bindPopup(popupContent).openPopup();
                            var pop = new L.popup().
                            setLatLng(e.latlng).
                            setContent(popupContent);
                            pop.addTo(map);
                        })
                    })(i, places.get("name"));
                });
                map.addLayer(markers);
            })();

            var control = L.control.layers(baseLayers, overlayMaps, {
                collapsed: false,
                position: 'topright'
            });

            control.addTo(map);

            for (var row in control._layers) {
                console.log(control._layers);
                leafletMeta[L.Util.stamp(control._layers[row].layer)] = control._layers[row].name;
            }

            /*var category_index = leaflet_meta[L.Util.stamp(a.layer)];
            markers.addLayers(markers_category[category_index]);*/

            map.on('overlayadd', function(a) {
                var categoryIndex = leafletMeta[L.Util.stamp(a.layer)];
                markers.addLayers(markersCategory[categoryIndex]);
            });

            map.on('overlayremove', function(a) {
                var categoryIndex = leafletMeta[L.Util.stamp(a.layer)];
                markers.removeLayers(markersCategory[categoryIndex]);
            });
            /*for (var j = 0; j < count.length; j++) {

            }*/

            //console.log("MK::"+overlayMaps);
        }

        //$(':checkbox').prop("")
        //L.control.layers(overlayMaps).addTo(map);
    });
    return MapView;
});
