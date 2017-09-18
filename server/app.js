//加载http模块
var http=require('http');
//加载express模块
var express=require('express');
//加载模板处理模块
var swig=require('swig');
//加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载session模块和本地存储session模块
var session = require('express-session');
//加载cookie-parser模块读取cookie
var cookieParser= require('cookie-parser')
//创建app应用
var app=express();

var userName={name:''};

//定义模板引擎
//第一个参数：模板引擎名称，也是模板文件后缀，第二个参数表示处理模板的方法
app.engine('html',swig.renderFile);
//配置模板文件存放的路径
app.set('views','./views');
//注册所使用的模板引擎，第一个参数必须是view engine,第二个参数是模板引擎名称
app.set('view engine','html');
//开发过程中，取消模板缓存;
swig.setDefaults({cache:false});

//设置中间件，使用cookieParser
app.use(cookieParser());
app.use(session({
    name: 'userCID',
    secret: 'keyboard cat',  // 用来对session id相关的cookie进行签名
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
}));

//bodyparser设置
app.use(bodyParser.urlencoded({extended: true}));//处理post发送过来的表单数据
app.use(bodyParser.json()); //处理post发送来的json数据

//静态文件托管
app.use( '/dist', express.static( './dist') );

app.all('*',function(req,res,next){
	if(/favicon/.test(req.url)){res.end();return}
	res.setHeader('Access-Control-Allow-Across','*');
	if (req.cookies.username) {
		userName.name=req.cookies.username;
	}
	next();
});

app.get('/',function(req,res,next){
	//用res.render方法读取配置好的目录下的文件，然后解析并返回给浏览器
	//第一个参数表示目录下的文件名
	res.render('index');
})
app.get('/index',function(req,res,next){
	//用res.render方法读取配置好的目录下的文件，然后解析并返回给浏览器
	//第一个参数表示目录下的文件名
	res.render('index');
})

app.use('/chat',require('./routers/chatRoute.js'));
app.use('/user',require('./routers/userRoute.js'));


//创建服务器
var server=http.createServer(app).listen(8081);
console.log('server is running on port 8081');

var io = require('socket.io')(server);
var socket=require('./routers/socketRoute.js');

socket(io,userName);

// io.on('connection',function(socket){
// 	console.log('有人进来了');
// 	socket.emit('public','有心人进来了');
// });
// socket.sockets.on('connection',function(socket){
// 	console.log('有人进来了');
// 	socket.emit('public','有心人进来了');
// });