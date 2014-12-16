define([
    'jquery',
    'underscore',
    'backbone',
    'leaflet',
    'markercluster',
    'collections/collection',
    'leaflet-search',
    'leaflet-control-locate',
    'leaflet.groupedlayercontrol',
    'text!templates/map.html'
], function($, _, Backbone, L, markercluster, mapCollection, leafletSearch, leafletLocate, groupedLayerControl, mapTemplate) {

    var MapView = Backbone.View.extend({
        el: '#map',
        template: _.template(mapTemplate),
        initialize: function() {
            var map;
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

            var active = new L.LayerGroup();
            var inactive = new L.LayerGroup();

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

            //var markers; // = {},
            var markers = {};

                    markers = L.markerClusterGroup({
                        spiderfyOnMaxZoom: true,
                        zoomToBoundsOnClick: false
                    });

            (function() {

                _.each(placeModels.data, function(places) {


                    var i = 0;
                    while (i < places.get("count")) {

                        var title = places.get("name");
                        var marker = L.marker(new L.LatLng(places.get("lat"), places.get("lng")), {
                            title: title
                        });
                        marker.bindPopup(title);

                        if (i < places.get("active")) {
                            marker.addTo(active);
                        } else {
                            marker.addTo(inactive);
                        }

                        markers.addLayer(marker);
                        i++;
                    }

                    (function(k, placeName) {
                        markers.on('clusterclick', function(e) {

                            var data = "whatever";
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
            })();
            map.addLayer(markers);

             var groupedOverlays = {
                "Positions": {
                    "Active": active,
                    "Inactive": inactive
                }
            };

            var layercontrol = L.control.groupedLayers(baseLayers, groupedOverlays, {
                collapsed: true,
                position: 'topright'
            });

            map.addControl(layercontrol);
        }
    });
    return MapView;
});
