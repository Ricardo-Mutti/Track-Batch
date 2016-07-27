module.exports = function(nodeMailer) {
	var env = process.env.NODE_ENV || 'development';

	var smtpConfig = {
	    host: 'smtp.gmail.com',
	    port: 465,
	    secure: true, // use SSL
	    auth: {
	        user: 'appsimples@gmail.com',
	        pass: 'app123654'
	    }
	};

	return{

		mongoURI : function(){
			if (env === 'development') {
				return 'mongodb://tcc:tcc@ec2-52-38-92-76.us-west-2.compute.amazonaws.com:27017/tcc';
			}

			// production only
			else if (env === 'production') {
			  return 'mongodb://appsimples-bowl:appsimples-bowl-production@ec2-52-201-135-248.compute-1.amazonaws.com:27017/bowl';
			}
		},
		pushUrl: function(){
			if (env === 'development') {
				return 'http://ec2-54-210-71-210.compute-1.amazonaws.com:1234';
			}

			// production only
			else if (env === 'production') {
				return 'http://ec2-52-201-135-248.compute-1.amazonaws.com:1234'
			}
		},
		apiSecret : function(){
		// chave para validacao do token para usuarios comuns: appsimples-conceito-a-api-secret md5
			return 'e9b4e7b0a636963f1a543eb6f3dbc317';
		},
		apiSecretAdmin : function(){
		// chave para validacao do token para usuarios admin: appsimples-conceito-a-api-secret-admin md5
			return '125e17d6451bc544bdee957a478030bb';
		},
		saltRounds : function(){
			return 4;
		},
		transporter : function(){
			var transporterNodeMailer = nodeMailer.createTransport(smtpConfig);
			return transporterNodeMailer;
		}
	};
}

