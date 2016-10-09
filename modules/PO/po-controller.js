module.exports = function(schema) {

  var PO = schema.po;
  var Batch = schema.batch;
  var Product = schema.product;
  var POID;
  var batches = [];//Essas variaveis precisam ser globais por causa do asincronismo das query
  var size = 0;

  function createBatch(product, qnt) { //Função pra criar um batch a partir do subproduto

      var batch = {};
      batch.productName = product.productName;
      batch.qnt = qnt;
      batch.POID = POID;
      batch.batchStatus = 'ready';

      var newBatch = new Batch(batch); //Aqui converte pra variavel que vai ser salva no banco Batch
      newBatch.save(function(err){if (err) throw  err;});
      //O retorno desse endpoint junta as informaçoes de duas tabelas, a de batch e a de produtos
      batch.ETC = product.ETC;
      batch.price = product.price;
      batch.activities = product.activities;

      return batch;
  }

  function searchSubProduct(productName, qnt, res) { //Função recursiva pra chegar nos produtos primários. 
      // Repare que a qnt se mutiplica. Se o prod A precisa de 1 prod B e 4 prod C então se na ordem temos 9 prod A 
      // temos entao -> 9 prod A = 9 pro B + 36 prod C. Esse são os batches a serem produzidos.

      Product.findOne({ "productName": productName }, function(err, product) {
          if (err) throw err;
          if (product) { //Achando o produto com esse nome precisamos ver se ele tem subprodutos ou é primario
              if (product.subProduct.length == 0) {
        
                  batches.push(createBatch(product, qnt));
                  // console.dir(JSON.stringify(batches));
                  console.dir("BatchName" + product.productName.toString());
                  console.dir("length: " + batches.length.toString());
                  console.dir("size: " + size.toString());
                  if (batches.length == size) {
                      // size = 0;
                      var localBatches = batches.splice(0,batches.length);
                      size=0;
                      // localBatches = batches;
                      // batches.length = 0;
                      return res.json({ success: true, message: 'Batches', response: { localBatches } });
                  }

              } else {
                  //Se o produto tem subprodutos ele adiciona no tamanho final de batches e tira um pq na realidade esse produto será so intermediario
                  //    |-B
                  // A -|-C      array de size um vira size 3
                  //    |-D
                  console.dir("name: " + productName.toString());
                  // console.dir("sizeName: "+(size + product.subProduct.length-1).toString());
                  size = size + product.subProduct.length-1;

                  for (var index = 0; index < product.subProduct.length; index++) {
                      searchSubProduct(product.subProduct[index].productName, (product.subProduct[index].qnt) * (qnt), res, size);
                  }
              }
          }
      });
  }

  return {

      registerPO: function(req, res) {

          var newPO = new PO(req.body);

          newPO.save(function(err) {
              if (err) throw err;
              return res.json({ success: true, message: 'PO registered', response: { newPO } });
          })
      },

      approvePO: function(req, res) {
          //TODO: colocar filtro pra so fazer isso com POStatus orded
          PO.findOneAndUpdate({ "_id": req.body._id }, { "POStatus": "approved" }, { new: true }, function(err, PO) {
              if (err) throw err;
              if (PO) {
                  POID = req.body._id;
                  for (var index = 0; index < PO.orders.length; index++) { //Vai explodir as PO nos diversos produtos
                    size= PO.orders.length;
                      searchSubProduct(PO.orders[index].productName, PO.orders[index].qnt, res);
                  }
              } else {
                  return res.json({ success: false, message: 'Cannot approve. PO dont exist!' });
              }
          });
      },

      getPOOrded: function(req, res) {

          PO.find({ "POStatus": "orded" }, function(err, pos) {
              if (err) throw err;
              return res.json({ success: true, message: 'POs founded', response: { pos } });
          });
      },

      getPODone: function(req, res) {

          PO.find({ "POStatus": "done" }, function(err, pos) {
              if (err) throw err;
              return res.json({ success: true, message: 'POs founded', response: { pos } });
          });
      },

      getPOApproved: function(req, res) {

          PO.find({ "POStatus": "approved" }, function(err, pos) {
              if (err) throw err;
              return res.json({ success: true, message: 'POs founded', response: { pos } });
          });
      },

      getUserPO: function(req, res) {

          PO.find({ "client": req.body.client }, function(err, pos) {
              if (err) throw err;
              return res.json({ success: true, message: 'POs founded', response: { pos } });
          });
      }

  }
}