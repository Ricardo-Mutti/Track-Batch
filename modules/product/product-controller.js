module.exports = function (schema){

  var Product = schema.product;
  return {

    registerProduct: function(req, res){

       var newProduct = new Product(req.body);
  
        Product.findOne({productName: newProduct.productName}, function(err,product){
        if (err){
         return res.json({status: 500, error: err});
         }
        if(product){
          return res.json({success: false, message: "This product is already registered"});
        }else{
          newProduct.save(function(err){
        if (err){
         return res.json({status: 500, error: err});
         }
          return res.json({success: true, message: 'New Product registered', response: {newProduct}});
        })
         }
       });
    },
    
    getProduct: function(req, res){

       Product.find({"type": "photo"}, function(err,products){
        if (err) throw err;
          return res.json({success: true, message: 'Products founded', response: {products}});  
       });
    },

    getBlueprints: function(req, res){

       Product.find({"type": "blueprint"}, function(err,products){
        if (err) throw err;
          return res.json({success: true, message: 'Blueprints founded', response: {products}});  
       });
    },

    editProduct: function (req, res) {
      var query = {};
      var update = req.body;
      if (req.body.productName){
        query.productName = req.body.productName;
        Product.findOneAndUpdate(query, update, {new: true}, function(err, newProduct){
          if (err) throw err;
          if (newProduct){
            return res.json({success: true, message: 'Product Updated!', response: {productUpdate: newProduct}});
          }else return res.json({success: false, message: 'Product not found!'});
        })
      }else return res.json({success: false, message: 'Missing parameters!'});
    }



  }
}




