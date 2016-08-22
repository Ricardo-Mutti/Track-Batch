	module.exports = function() {
	//Pega o enviorment se for setado no terminal, caso for undefined é development
	//Para mudar o env vai no terminal: export NODE_ENV=production (nao testei)
	var env = process.env.NODE_ENV || 'development';

		return{

		mongoURI : function(){
			if (env === 'development') {
				return 'mongodb://localhost/tcc';
			}else if (env === 'production'){
				return 'mongodb://tcc:tcc@ec2-52-38-92-76.us-west-2.compute.amazonaws.com:27017/tcc';
			}
		},

		apiSecret : function(){
		// chave para validacao do token para usuarios comuns
			return 'e9b4e7b0a636963f1a543eb6f3dbc317';
		}
	};
}