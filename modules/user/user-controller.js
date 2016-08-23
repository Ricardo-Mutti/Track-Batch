module.exports = function (schema){

 var User = schema.user;

return {

    editUser: function (req, res) {
      var query = {};
      var update = req.body;
      if (req.body.email){
        query.email = req.body.email;
        User.findOneAndUpdate(query, update, {new: true}, function(err, user){
          if (err) throw err;
          if (user){
            return res.json({success: true, message: 'User Updated!', response: {userUpdated: user}});
          }else return res.json({success: false, message: 'User not updated!'});
        })
      }else return res.json({success: false, message: 'Missing parameters!'});
    },
	
	getUser: function(req, res){

		var query = {};
       if (req.body.role){
		query.role = req.body.role;
        User.find(query, function(err, users){
          if (err) throw err;
          if (users){
            return res.json({success: true, message: 'Users Array!', response: {users: users}});
          }else return res.json({success: false, message: '0 Users found!'});
        })
      }else return res.json({success: false, message: 'Missing parameters!'});
	}


	
  }
}