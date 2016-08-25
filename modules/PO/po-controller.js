module.exports = function (schema){

  var PO = schema.po;
  return {

    registerPO: function(req, res){

       var newPO = new PO(req.body);

          newPO.save(function(err){
          if (err) throw  err;
          return res.json({success: true, message: 'PO registered', response: {newPO}});
        })
    },
    
    aprovePO: function(req, res){

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

    getPO: function(req, res){

       PO.find(function(err,pos){
        if (err) throw err;
          return res.json({success: true, message: 'POs founded', response: {pos}});  
       });
    }

  }
}




