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

    getMachineList: function(req, res){

         var removeFields = {//Só retorna os campos necessarios
                       _id: 0,
                       __v:0,
                   }

     Machine.find({},removeFields, function(err,machine){//Tem que colocar uma query vazia se não ele acha que o removeFields é a query
      if (err) throw err;
      if(machine){
        return res.json({success: true, message: "Machines found", response: {machine}});
      }else{
        return res.json({success: false, message: 'No machines not registered'});
       }
     });
    }



  }
}