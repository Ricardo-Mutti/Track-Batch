module.exports = function (schema){

  var Batch = schema.batch;
  return {

    registerBatch: function(req, res){

       var newBatch = new Batch(req.body);

          newBatch.save(function(err){
          if (err) throw  err;
          return res.json({success: true, message: 'Batch created', response: {newBatch}});
        })
    },
    
    getBatch: function(req, res){

       Batch.find( {'batchStatus': { $ne: 'finished' } },function(err,batches){
        if (err) throw err;
          return res.json({success: true, message: 'Batches founded', response: {batches}});  
       });
    },

    getFinishedBatch: function(req, res){

       Batch.find( {'batchStatus': 'finished'},function(err,batches){
        if (err) throw err;
          return res.json({success: true, message: 'Finished batches founded', response: {batches}});  
       });
    }


  }
}