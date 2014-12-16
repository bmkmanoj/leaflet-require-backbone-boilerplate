define([
    'jquery',
    'backbone',
    'underscore',
    'views/menuview',
    'views/mapview'],
    function($, Backbone, _, menuView, mapView){
        var Router = Backbone.Router.extend({
            initialize: function(){
                this.mapView = new mapView;

                //this.mapView.render();
                (function(that){
                    that.mapView.collection.fetch({
                        silent: true,
                        success:function(){
                            //console.log("NOWWWW HERE ");
                            that.mapView.render();
                        }
                    });
                })(this);

                this.menuView = new menuView;
                this.menuView.bind('collectionSelected',this.setLocation, this);

                Backbone.history.start({pushState: true, root:'/'});
            },
            routes: {
				'':'setLocation',
                'places/*name': 'getLocation'
            },
            setLocation: function(e){
                if (e){Backbone.history.navigate('places/'+e.get('name').replace(' ','+'), false);}
                this.mapView.updateMap(e);

            }
            ,
            getLocation: function(e){
                this.menuView.updateModel(e);
            }
        });

        return Router;
    });