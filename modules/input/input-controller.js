module.exports = function (schema){

  var Batch = schema.batch;

  return {

      registerRFIDInput: function(req, res){

         var inputMachine = req.body.inputMachine;
         var inputDate = req.body.inputDate;
         var query = {};
         query.batchStatus = 'ready';
         query.firstMachine = inputMachine;

         var update = {};
         update.fabDate = inputDate;
         update.currentMachine = inputMachine;
         update.batchStatus = 'started';
     
          Batch.findOneAndUpdate(query, update, {new: true}, function(err, batch){
            if (err) throw err;
            if (batch){
              return res.json({success: true, message: 'Batch Updated!', response: {batchUpdated: batch}});
            }else return res.json({success: false, message: 'Batch not founded!'});
          })
      },

      registerOperatorInput: function(req, res){

         var inputDate = req.body.inputDate;
         var query = {};
         query._id = req.body.batchID;

         var update = {};
         update.fabDate = inputDate;
         update.batchStatus = 'ready';

          Batch.findOneAndUpdate(query, update, {new: true}, function(err, batch){
            if (err) throw err;
            if (batch){
              return res.json({success: true, message: 'Batch Updated!', response: {batchUpdated: batch}});
            }else return res.json({success: false, message: 'Batch not founded!'});
          })
      }

    }
  }
