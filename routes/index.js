exports.index = function(req, res) {
	res.sendfile('public/index.html');
}
exports.session = function(req,res){
	res.send(req.session);
}
exports.weiboLoginCallback = function(req,res){
	
}

exports.focusPerson = function(req,res){
	res.sendfile('public/weiboperson.html');
}

exports.tasklist = function(req,res){
	res.sendfile('public/tasklist.html');
}
