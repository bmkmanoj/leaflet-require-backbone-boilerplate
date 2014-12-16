require.config({
    baseUrl: "js",
    paths: {
        jquery: 'libs/jquery-1.8.2.min',
        modernizr: 'libs/modernizr-2.6.1-respond-1.1.0',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        async: 'libs/async',
        text: 'libs/text',
        templates: '../templates',
        leaflet: 'libs/leaflet-src',
        markercluster: 'libs/leaflet.markercluster-src',
        'geocontrol.leaflet': 'libs/Control.Geocoder',
        'leaflet-search': 'libs/leaflet-search.src',
        'leaflet-control-locate': 'libs/L.Control.Locate',
        'leaflet.groupedlayercontrol': 'libs/leaflet.groupedlayercontrol',
        'leaflet-providers': 'libs/leaflet-providers',
        'leaflet-fullscreen': 'libs/Leaflet.fullscreen'
    },
    'shim':{
        backbone:{
            'deps' :['jquery' ,'underscore'],
            'exports' : 'Backbone'
        },
        modernizr:{
            'exports' : 'Modernizr'
        },
        underscore: {
            'exports': '_'
        },
        leaflet: {
            'exports': 'L'
        },
        markercluster: {
            'deps': ['leaflet']
        },
        'geocontrol.leaflet': {
            'deps': ['leaflet']
        },
        'leaflet-search': {
            'deps': ['leaflet']
        },
        'leaflet-control-locate': {
            'deps': ['leaflet']
        },
        'leaflet.groupedlayercontrol': {
            'deps': ['leaflet']
        },
        'leaflet-providers': {
            'deps': ['leaflet']
        },
        'leaflet-fullscreen': {
            'deps': ['leaflet']
        }
    },
    waitSeconds: 10
    //urlArgs: 'v='+Math.floor(Math.random()*99999)
});

require([
    'app'
], function(App){
    App.initialize();
});