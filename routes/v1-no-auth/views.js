module.exports = function (){
  
	return function(router){
	    router.get("/index", function(req, res){
    		res.render('index.html');
	    });
	    router.get("/", function(req, res){
    		res.render('index.html');
	    });
	    router.get("/lista", function(req, res){
    		res.render('lista.html');
	    });
	    router.get("/novo_video", function(req, res){
    		res.render('novo_video.html');
	    });
	    router.get("/editar_video", function(req, res){
    		res.render('novo_video.html');
	    });
	    router.get("/adicionar_categoria", function(req, res){
    		res.render('adicionar_categoria.html');
	    });
	    router.get("*", function(req, res){
    		res.render('index.html');
	    });
	}
}