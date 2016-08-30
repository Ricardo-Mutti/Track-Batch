module.exports = function (schema){

  var Batch = schema.batch;

  return {

    registerInput: function(req, res){

       var inputMachine = req.body.inputMachine;
       var inputDate = req.body.inputDate;
       var query = {};
       query.batchStatus = 'ready';

         Batch.find(function(err,batches){
        if (err) throw err;
          return res.json({success: true, message: 'Batches founded', response: {batches}});  
       });


          newBatch.save(function(err){
          if (err) throw  err;
          return res.json({success: true, message: 'Batch created', response: {newBatch}});
        })
    },
    
    getBatch: function(req, res){

     
    }
  }
}