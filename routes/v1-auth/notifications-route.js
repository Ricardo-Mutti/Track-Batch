module.exports = function (moduleNotifications){
  
  var controllers = moduleNotifications.controllers;

  return function(router){
    router.get("/get-notifications", function(req, res){
    	controllers.notifications.getNotifications(req, res);
    });
  }
}