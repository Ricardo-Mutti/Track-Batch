module.exports = function (schema){

  var Machine = schema.machine;
  return {

    registerMachine: function(req, res){

      var newMachine = new Machine(req.body);

       Machine.findOne({machineName: newMachine.machineName}, function(err,machine){
        if (err) throw err;
        if(machine){
          return res.json({success: false, message: "This machine is already registered"});
        }else{
          newMachine.save(function(err){
          if (err) throw  err;
          return res.json({success: true, message: 'Machine registered', response: {newMachine}});
        })
         }
       });
    },

    getMachine: function(req, res){

       Machine.findOne({machineName: req.body.machineName}, function(err,machine){
        if (err) throw err;
        if(machine){
          return res.json({success: true, message: "Machine found", response: {machine}});
        }else{
          return res.json({success: false, message: 'Machine not registered'});
         }
       });
    }
  }
}