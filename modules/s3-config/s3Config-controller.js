module.exports = function (crypto, config){

  var MS_PER_MINUTE = 60000;
  var accessKey = config.s3AccessKey();
  var secretKey = config.s3Secret();

  var readPolicy = function(accessKey, secretKey, key, bucket, duration) {
    var dateObj = new Date;
    var expiration = new Date(dateObj.getTime() + duration * 1000);
    expiration = Math.round(expiration.getTime() / 1000);

    var policy = 'GET\n\n\n' + expiration + '\n';
    policy += '/' + bucket + '/' + key;

    var signature = crypto.createHmac("sha1", secretKey).update(policy);

    var url = 'https://s3.amazonaws.com/';
    url += bucket + '/';
    url += key;
    url += '?AWSAccessKeyId=' + accessKey;
    url += '&Expires=' + expiration;
    url += '&Signature=' + encodeURIComponent(signature.digest("base64"));
    
    return url;

  };

  var writePolicy = function(accessKey, secretKey, bucket, duration, filesize) {
    var dateObj = new Date;
    var dateExp = new Date(dateObj.getTime() + duration * 1000);
    var policy = {
        "expiration":dateExp.getUTCFullYear() + "-" + dateExp.getUTCMonth() + 1 + "-" + dateExp.getUTCDate() + 
          "T" + dateExp.getUTCHours() + ":" + dateExp.getUTCMinutes() + ":" + dateExp.getUTCSeconds() + "Z",
        "conditions":[
            { "bucket":bucket },
            { "acl":"public-read" },
            ["starts-with", "$key", ""],
            ["content-length-range", 0, filesize * 1000000],
            ["starts-with", "$Content-Type", ""]
        ]
    };

    var policyString = JSON.stringify(policy);
    var policyBase64 = new Buffer(policyString).toString('base64');
    var signature = crypto.createHmac("sha1", secretKey).update(policyBase64);
    var accessKey = accessKey;
    s3Credentials = {
        policy: policyBase64,
        signature: signature.digest("base64"),
        key: accessKey
    };

    return s3Credentials;
  };

  return {
    s3Write : function(req, res){
      // Retorna objeto de credencial do S3 contendo write-policy, signature e key;
      var accessKey = config.s3AccessKey();
      var secretKey = config.s3Secret();

      var s3Credentials = writePolicy(accessKey, secretKey, "bowl-appsimples", 60, 10);

      return res.json(s3Credentials);
    },

    s3Read : function(req, res){
      // Retorna objeto de credencial do S3 contendo read-policy, signature e key;
      var accessKey = config.s3AccessKey();
      var secretKey = config.s3Secret();
      var key = req.params.key;

      var s3Credentials = readPolicy(accessKey, secretKey, key, "bowl-appsimples", 60);

      return res.json(s3Credentials);
    }
  }
}