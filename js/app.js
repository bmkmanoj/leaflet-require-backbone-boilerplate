define(['routers/home'], function(router){
    var initialize = function(){
        this.router = new router();
    }
    return { initialize: initialize};
});
