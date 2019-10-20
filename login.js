var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var admin_id;
var path = require('path');
var router=express.Router();
global.admin_id;
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'prison1'
});

var app = express();
app.set('html');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/delete', function(req, res) {
    connection.query("select visitor_id FROM has WHERE prisoner_id = ?", req.query['category'] , function(error, results, fields) {
   vid=results[0].visitor_id;
   pid=req.query['category'];
   //vid=req.query['category'];
   console.log(vid);
   console.log(vid);
	connection.query("DELETE FROM `visitors` WHERE `visitors`.`visitor_id` = ?", [vid] , function(error, results, fields) {
	connection.query('SELECT * FROM visitors WHERE visitor_id in (select visitor_id from has where prisoner_id=?)',[pid] , function(error, results, fields) {
	res.render('visitors.html',{visitors:results,id:pid});
	 //res.redirect('/visitors')	
	  });
	});
	});
});
app.get('/deletep', function(req, res) {
    connection.query('DELETE FROM prisoners WHERE prisoner_id=?', req.query['category'] , function(error, results, fields) {
		   console.log(results);
		  
		   res.render('home.html',{prisoners:results,id:req.query['category']});
		 res.redirect('/home')	
		});
		});

		app.get('/here', function(req, res) {
  console.log('Category: ' + req.query['category']);
connection.query('SELECT * FROM prisoners WHERE prisoner_id=?', req.query['category'] , function(error, results, fields) {
	res.render('prisoner.html',{prisoner:results});

});
});
app.get('/appoint', function(req, res) {
  
connection.query('SELECT * FROM visitors WHERE visitor_id in (select visitor_id from has where prisoner_id=?)', req.query['category'] , function(error, results, fields) {
	console.log(results);
	res.render('visitors.html',{visitors:results,id:req.query['category']});

});
});

app.get('/profile', function(req, res) {
  
	connection.query('SELECT * FROM officers WHERE admin_id=?', req.query['category'] , function(error, results, fields) {
		console.log(results);
		res.render('profile.html',{officers:results});
	});
	});


app.get('/routeBack', function(req, res) {
  
	connection.query('SELECT * FROM prisoners WHERE prisoner_id=?', req.query['category'] , function(error, results, fields) {
		res.render('prisoner.html',{prisoner:results});
	});
	});

app.get('/edit', function(req, res) {
	connection.query('SELECT case_id FROM commited c,prisoners p where p.prisoner_id=? and p.prisoner_id=c.prisoner_id',req.query['category'] , function(error, results, fields) {
	   var temp=[];
	   temp=results;
		console.log(results[6]);
		connection.query('SELECT * FROM prisoners where prisoner_id=?',req.query['category'],function(error, results, fields){
		res.render('editPrisoner.html',{temp:temp,prisoner:results,id:req.query['category']});
		});
	});
  
  });

  app.post('/updateCriminal',function(request,response){
	fname=request.body.fname;
	 lname=request.body.lname;
	pid=request.body.pid;
	 address=request.body.address;
	datei=request.body.doi;
	 datej=request.body.dou;
	 age=request.body.age;
	 cid=request.body.cid;
//	 connection.query('SELECT * from prisoners where prisoner_id=?',request.query['category'],function(error,results,fields){
	//  pid=results[0].prisoner_id;
		if(fname && pid)
		connection.query('UPDATE prisoners set pfname=? where prisoner_id=?',[fname,pid]); 
	//	connection.query('UPDATE prisoners p set p.pfname=?,p.lname=?,p.prisoner_id=?,p.paddress=?,p.dateofin=?,p.dateofin=?,p.dateofout=?,p.age=? where prisoner_id=pid',[fname,lname,pid,address,datei,datej,age],function(error, results, fields){
	    if(lname && pid) 
		connection.query('UPDATE prisoners set lname=? where prisoner_id=?',[lname,pid]);	
	    if(address && pid) 
		connection.query('UPDATE prisoners set paddress=? where prisoner_id=?',[address,pid]);
		if(datei && pid) 
		connection.query('UPDATE prisoners set dateofin=? where prisoner_id=?',[datei,pid]);
		if(datej && pid) 
		connection.query('UPDATE prisoners set dateofout=? where prisoner_id=?',[datej,pid]);
		if(age && pid) 
		connection.query('UPDATE prisoners set age=? where prisoner_id=?',[age,pid]);
		if(cid && pid)
		connection.query('UPDATE commited set case_id=? where prisoner_id=?',[cid,pid]);
		
	   response.redirect('/home');
	   response.end();

});	
	
app.get('/rouVis', function(req, res) {
	id=req.query['category'];
res.render('addVisitor.html',{id:id});
});

app.get('/rouCriminal', function(req, res) {
  sid=req.query['category'];
res.render('addCriminal.html',{sid:sid});
});

app.post('/addVis',function(request,response){
fname=request.body.fname;
lname=request.body.lname;
vid=request.body.vid;
pid=request.body.id;
console.log(fname);
console.log(lname);
console.log(vid);
console.log(pid);
var res=[];
	if (fname && lname && vid) {     
		//connection.query('insert into has values(?,?)',[vid,pid],function(error,result,fields){
     connection.query('insert into visitors values(?,?,?)', [vid,fname,lname] , function(error, results, fields) {
			 if(error)console.log("error");
			 connection.query('insert into has values(?,?)',[vid,pid],function(error,result,fields){
 				if(error)console.log("error");
		});
	// connection.query('SELECT * FROM prisoners WHERE prisoner_id=?',[pid],function(error, results, fields) {
	//	res.render('prisoner.html',{prisoner:results});
	    connection.query('SELECT * FROM visitors WHERE visitor_id in (select visitor_id from has where prisoner_id=?)',[pid] ,function(error, results, fields) {
		response.render('visitors.html',{visitors:results,id:pid}); 
	  });
	 	//response.redirect('/visitors');	
			//response.end();
	 });
		}
});

app.post('/addCriminal',function(request,response){
fname=request.body.fname;
lname=request.body.lname;
pid=request.body.pid;
address=request.body.address;
datei=request.body.doi;
datej=request.body.dou;
age=request.body.age;
sid=request.body.section_id;
cid=request.body.cid;
var res=[];
	if (fname && lname && sid) {                                                                                                                            
		connection.query('insert into prisoners values (?,?,?,?,?,?,?,?)', [pid,fname,lname,address,datei,datej,age,sid] , function(error, results, fields) {
			 if(error)console.log("error");
			 connection.query('insert into commited values(?,?)',[cid,pid],function(error,result,fields){
					  if(error)console.log("error");
			
});
response.redirect('/home');	
response.end();	
});
	}else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/auth', function(request, response) {
	username = request.body.username;
	 password = request.body.password;
	
	if (username && password) {
		connection.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password] , function(error, results, fields) {
			 if (results.length > 0) {

			 	console.log(results);
			 	request.session.loggedin = true;
			 	request.session.username = results.username;
			 	request.session.password=results.password;
			 	id=results[0].admin_id;
			 	
			 	console.log(username);
			 	console.log(password);
			 	console.log(id);
				response.redirect('/home');
			 } else {
			 	response.send('Incorrect Username and/or Password!');
			 }		
			// console.log(results.username);

			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


router.get('/home', function(request, response) {
var prisoners=[];
var priso=[];

// response.sendFile(path.join(__dirname + '/home.html'));
	 if (request.session.loggedin) 
		{
		console.log(id);
		connection.query('SELECT * FROM prisoners p where p.section_id  = (select  s.section_id from section s ,login l where s.admin_id=l.admin_id and l.admin_id=?)',[id],
			function(error, results, fields) {
			 console.log(results);
			for(var i=0;i<=results.length-1;i++)
			 	{prisoners.push(results[i]);
			 		//priso.push(results[i].prisoner_id);
			 	}
		console.log(prisoners);
		 for(var i=0;i<=1;i++)
		 		console.log(prisoners[i]);	
	  response.render('home.html',{username:username,prisoners:prisoners,sid:prisoners[0].section_id});
		 
	});
		
	} else {
	response.send('Please login to view this page!');
	
}
});
app.use('/', router);

app.listen(8800);