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
    }

  }
}




