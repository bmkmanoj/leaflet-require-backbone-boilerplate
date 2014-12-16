define([
    'jquery',
    'underscore',
    'backbone',
    'leaflet',
    'markercluster',
    'backbone.leaflet'
], function($, _, Backbone, L, markercluster, backbone.leaflet) {

    var MyPopupView = Backbone.Leaflet.PopupView.extend({
        // Set a custom template.
        template: _.template($('#popup-template').html()),

        // Bind some events.
        events: {
            'click .button': 'onButtonClick'
        },

        onButtonClick: function(evt) {
            var name = this.model.get('name');
            alert('Hey! You clicked on "' + name + '" popup.');
        }
    });
    return MapView;
});
