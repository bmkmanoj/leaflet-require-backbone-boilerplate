define([
    'jquery',
    'underscore',
    'backbone',
    'models/model'
], function($, _, Backbone, mapModel){
    var mapCollection = Backbone.Collection.extend({
        initialize: function(){
        },
        model: mapModel,

        url: './services/places.json',

        parse:function(response){
            return response;
        }
    });

    return mapCollection;
});
