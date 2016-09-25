module.exports = function (schema){

  var PO = schema.po;
  var Batch = schema.batch;
  var Product = schema.product;


  function createBatch (body, res){

        var batch = {};
                  batch.poductName = products.subProduct[index].productName;
                  batch.qnt = products.subProduct[index].qnt;
                  batch.POID = PO._id;
                  batch.batchStatus = 'ready';
                  var newBatch = new Batch(batch);
  }

  return {

    registerPO: function(req, res){

       var newPO = new PO(req.body);

          newPO.save(function(err){
          if (err) throw  err;
          return res.json({success: true, message: 'PO registered', response: {newPO}});
        })
    },
    
    approvePO: function(req, res){

      PO.findOneAndUpdate({"_id": req.body.POID}, {"POStatus": req.body.POStatus}, {new: true}, function(err,PO){
        if (err) throw err;
        if(PO){

          for(var index in PO.orders){//Vai explodir as PO nos diversos produtos
           Product.find({"productName" : PO.orders[index].productName}, function(err,products){
            
            if (err) throw err;

              if(products){//Achando os produtos
                for(var index in products.subProduct){
                  
          
                }
              }
            });
          }
          return res.json({success: true, message: 'PO Approved!'});  
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




