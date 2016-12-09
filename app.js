var express = require('express');
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var sessions = require('express-session')
var mongoStore = require('connect-mongo')(sessions)


//custom modules

var database = require("./database.js");
var myFunctions = require('./myfunctions.js')

// "Hello"
database.sayHelloInEnglish();
        
// "Hola"  
database.sayHelloInSpanish();


var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),

};


var app = express()

    https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    }, app).listen(443);


app.use(cookieParser())//before session
app.use(sessions({
	store: new mongoStore({
	  url:'mongodb://localhost:27017/thesessions',
	  ttl: 60
	    // db: 'users',
	    // host: 'mongodb://localhost',
	    // port: 27017
	  }),
	secret:'abc123',
	resave: false,
	saveUninitialized:false,
	cookie:{
		secure:true,
		maxAge: 60000	}

}))//before bodyParser

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))



app.get('/clearsession', function(req, res){
	console.log('req.session')
	console.log(req.session.id)
	req.session.destroy()
	console.log('req.session after destroy')
	console.log(req.session)


	res.end()
})
userSession = {}
app.get('/isset', function(req, res){
			res.set('Content-type','text/html')

	if(mySession.id){
		res.end('user logged in<input type="text">')
	}else{
		res.end('user not <input type="button" value="Button">')

	}

})

app.get('/', function(req, res){
	console.log('/============================================================')
console.log(req.sessionID)
if(req.session.id){
	console.log('got an ID '+req.session.id)
}else{
	console.log('got no ID ='+req.session.id)
}




	// console.log('this wrks')
	// console.log('req.query')
	// console.log(req.query)
	// console.log('req.params')
	// console.log(req.params)
	// console.log('req.body')
	// console.log(req.body)
	// console.log('req.route')
	// console.log(req.route)



	// console.log('req.protocol')
	// console.log(req.protocol)
	// console.log('req.ip')
	// console.log(req.ip)
	res.cookie('Maui' , 'Makers', {expire : new Date() + 1000})
	console.log('session -------------------------')
	console.log(req.session)
	console.log('Cookies!!!______________________')
	console.log(req.cookies)
	console.log('response set cookie header  :  '+res.get('set-cookie'))
	// res.send('cookies '+req.cookies+" : "+req.session)
	// res.write('This is Dave')

	res.sendFile(__dirname+'/client/index.html')

	// res.end()
})

app.get('/login', function(req, res){
		console.log('/getlogin============================================================')

	if(userSession.loggedIn){

		res.redirect('/admin')
		console.log('response admin set cookie header  :  '+res.get('set-cookie'))

	}else{
		res.sendFile(__dirname+'/client/login.html')
		console.log('response set cookie header  client/login:  '+res.get('set-cookie'))
	}
})

app.post('/login', function(req, res){
	console.log('/postlogin============================================================')

	if(req.body.username == 'admin' &&req.body.password == 'admin'){
		req.session.loggedIn = true
		req.session.username = req.body.username
		userSession.loggedIn = true
		userSession.username = req.body.username
		database.writeToMongo('admin', {
						'firstname':userSession.username,
						 'lastname':'barrar',
						 'loginTime':new Date()
						})
		res.redirect('/admin')
		console.log('response set cookie header login form post/login redir /admin:  '+res.get('set-cookie'))

	}else{
		res.set('Content-Type','text/html' )
	res.end(JSON.stringify(req.body)+'	<a href="/login">login</a>')
	console.log('response set cookie header  go to login:  '+res.get('set-cookie'))
	}

})

app.get('/admin', function(req, res){
	myFunctions.verifyUserLogedIn(res)
	res.sendFile(__dirname+'/client/admin.html')

})

app.get('/findPostsFromDB', function(req, res){
	database.readFromMongo('sessionsPost', function(cursorArray){
		res.send(cursorArray)	
	})
})

app.post('/adminPost', function(req, res){
	myFunctions.verifyUserLogedIn(res)
	console.log(req.body)
	if(!myFunctions.verifyObjNotEmpty(req.body)){

		database.writeToMongo('sessionsPost',req.body)
		console.log('req.body '+JSON.stringify(req.body))
		res.send('done')
	}else{
		console.log('empty object?')
		res.status(404).send('obj is empty?')
	}
	
})


app.get('/logout', function(req, res){
	myFunctions.userLogout(req, res)

})

app.use(express.static(__dirname+'/client'))
app.listen(7777, function(){
	console.log('Listenign on port 7777 !')

})


