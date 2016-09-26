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

 function searchSubProduct (productName, qnt){
     Product.findOne({"productName" : productName}, function(err,product){
      if (err) throw err;
       if(product){//Achando o produto com esse nome precisamos ver se ele tem subprodutos ou é primario
        if(product.subProduct.length==0){
           //createBatch
           console.dir(JSON.stringify(product.productName) +" "+ qnt);
        }else{
          for(var index=0; index< product.subProduct.length; index++){
            searchSubProduct(product.subProduct[index].productName, (product.subProduct[index].qnt)*(qnt));
            }
          }
       }    
     }); 
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

      var orders;

      PO.findOneAndUpdate({"_id": req.body._id}, {"POStatus": "approved"}, {new: true}, function(err,PO){
        if (err) throw err;
        if(PO){
          // console.dir(PO.orders.length.toString());
          orders = PO.orders;

          for(var index=0; index< PO.orders.length; index++){//Vai explodir as PO nos diversos produtos
            searchSubProduct(PO.orders[index].productName,PO.orders[index].qnt);
          }
          return res.json({success: true, message: 'PO Approved!'});  
        }else{
          return res.json({success: false, message: 'Cannot approve. PO dont exist!'});  
        }
       });
    },

    getPOOrded: function(req, res){

       PO.find({"POStatus" : "orded"}, function(err,pos){
        if (err) throw err;
          return res.json({success: true, message: 'POs founded', response: {pos}});  
       });
    },

    getPODone: function(req, res){

     PO.find({"POStatus" : "done"}, function(err,pos){
      if (err) throw err;
        return res.json({success: true, message: 'POs founded', response: {pos}});  
     });
    },

    getPOApproved: function(req, res){

     PO.find({"POStatus" : "approved"}, function(err,pos){
      if (err) throw err;
        return res.json({success: true, message: 'POs founded', response: {pos}});  
     });
    },

    getUserPO: function(req, res){

     PO.find({"client" : req.body.client}, function(err,pos){
      if (err) throw err;
        return res.json({success: true, message: 'POs founded', response: {pos}});  
     });
    }
    
  }
}




