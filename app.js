var express = require('express');
var routes = require('./routes');
var everyauth = require('everyauth')
var mongoose = require('mongoose');
var weibo = require('weibo');
var app = express(); 

var usersById = {};
var nextUserId = 0;
var usersByWeiboId = {};
var conf = {
	weibo : {
		appId : '811226246',
		appSecret : '830dc7bbe7dc83b3428df276abc52cbd'
	}
}
function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}
everyauth.debug = true;
everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });
everyauth.weibo.appId(conf.weibo.appId).appSecret(conf.weibo.appSecret).findOrCreateUser(function(session, accessToken, accessTokenExtra, weiboUser) {
	return usersByWeiboId[weiboUser.uid] ||
        (usersByWeiboId[weiboUser.uid] = addUser('weibo', weiboUser));
}).redirectPath("/focusperson");


app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser('secret'));
app.use(express.session({
	secret : 'secret'
})); 
app.use(everyauth.middleware(app)); 

app.get('/index', routes.index);
app.get('/session', routes.session);
app.get('/weibologincallback', routes.weiboLoginCallback);
app.get('/focusperson' , routes.focusPerson)
app.get('/tasklist' , routes.tasklist)
app.listen(80); 
console.log('start 80');
