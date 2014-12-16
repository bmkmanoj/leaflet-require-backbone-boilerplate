define([
    'jquery',
    'underscore',
    'backbone',
    'collections/collection',
    'text!templates/menu.html'
], function($, _, Backbone, mapCollection, mainTemplate){
    var MenuView = Backbone.View.extend({
        el: '#menu',

        events:{
          'click a': "selectPlace"
        },

        initialize: function(){
            this.collection = new mapCollection();
            this.collection.fetch();
            this.collection.bind("reset", function(){this.render();}, this);
        },

        render: function(){

            var placeModels = {
                data: this.collection.models
            }

            this.$el.html(_.template(mainTemplate, placeModels));
        },

        updateModel:function(e){
            var place = e.replace('+', ' ');
            var self = this;
            this.collection.fetch({
                success:function(data){
                    _.find(data.models, function(el){
                        if(el.get('name')==place){
                            $('li:nth('+self.collection.indexOf(el)+')').addClass('active');
                            self.trigger("collectionSelected", el);
                        }
                    });
                }
            });
        },

        selectPlace:function(e){
            e.preventDefault();
            this.$el.find('li').removeClass('active');
            $(e.currentTarget).parent().addClass('active');
            var index = $('li a').index(e.currentTarget);
            this.trigger("collectionSelected", this.collection.models[index]);
        }
    });
    return MenuView;
});
