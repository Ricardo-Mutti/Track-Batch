module.exports = function (schema){

  var Batch = schema.batch;
  var Product = schema.product;
  var batches = [];

   function creteResponse(batch, res, size) { 
      Product.findOne({ "productName": batch.productName }, function(err, product) {
          if (err) throw err;
          if (product) { 
              batch.ETC = product.ETC;
              batch.price = product.price;
              batch.activities = product.activities;
              batches.push(batch);
              console.dir("length "+ batches.length + size);
              if (batches.length == size) {
                  return res.json({ success: true, message: 'Batches founded', response: { batches } });
                  size = 0;
              }
          }
      });
  }
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

         for (var index = 0; index < batches.length; index++) { //Vai explodir as PO nos diversos produtos
                      creteResponse(batches[index], res, batches.length);
                      // console.dir(JSON.stringify(batches[index]));
                  } 

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