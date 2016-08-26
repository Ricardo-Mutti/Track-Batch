module.exports = function (schema){

  var Product = schema.product;
  return {

    registerProduct: function(req, res){

       var newProduct = new Product(req.body);

          newProduct.save(function(err){
          if (err) throw  err;
          return res.json({success: true, message: 'Product registered', response: {newProduct}});
        })
    },
    
    getProduct: function(req, res){

       Product.find(function(err,products){
        if (err) throw err;
          return res.json({success: true, message: 'Products founded', response: {products}});  
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




