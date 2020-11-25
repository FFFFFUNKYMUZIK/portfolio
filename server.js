//refers to : https://jeonghwan-kim.github.io/dev/2020/06/20/passport.html

const host = '127.0.0.1'
const port = 8080

const express = require('express');
/* TODO : change to https */
const http = require('http');
const path = require('path');

const url = require('url');
const fs = require('fs');

const app = express();
const router = require('./router.js');

const session = require('express-session'); // 세션 설정
const passport = require('passport');
const passportConfig = require('./passport');

const connectdb = require('./db.js');

const methodOverride = require('method-override');
const bodyParser = require('body-parser');

app.use(session({
	secret: 'encryption-code',
	resave: false,
	saveUninitialized: true,
	})
); 

/*
app.use(passport.initialize()); // passport 구동
app.use(passport.session()); // 세션 연결
*/


connectdb();

passportConfig();

app.use(methodOverride()); //for post, put, delete, patch
app.use(bodyParser.json()); //json parsing (to object) and save to req.body
app.use(bodyParser.urlencoded({extended:true})); //enable to parse nested object

app.use(express.static(path.join(__dirname, 'client')));
//app.use('/', express.static(path.join(__dirname, 'client')));
app.use('/', router);

app.listen(port, host, () => {
	console.log(`Express server listen : http://${host}:${port}/`);
})
