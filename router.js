const exp = require('express');
const path = require('path');
const router = exp.Router();
const passport = require('passport');

/* crypto func */
const {encrypt, decrypt} = require('./crypto');

/* db schema */
const Users = require('./user.js');

/* redirect to login page for who is not authenticated */
const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/login');
};

/* favicon request */
router.get('/favicon.ico', (req, res) =>{
  res.sendFile(path.join(__dirname, 'data', 'image', 'favicon.ico'));
})

router.get('/', isAuthenticated, (req,res) =>{
   console.log(req.connection.remoteAddress, "enters!");
	 res.redirect('/profile');
})

/* for debug */
/*
router.get('/session-debug', (req,res) =>{
	res.json({
    "req.session": req.session, // 세션 데이터
    "req._passport": req._passport, // 패스포트 데이터
  })
})
*/

router.get('/login', (req,res, next) =>{
  if (req.isAuthenticated()){
    res.redirect('/');
    return next();
  }
  res.sendFile(path.join(__dirname, 'data', 'html','login.html'));
})

router.get('/profile', isAuthenticated, (req,res) =>{
	  res.sendFile(path.join(__dirname, 'data', 'html','main.html'));
})

/* for subdirectory which is controled by client */
/* if client refresh page like $(hostname)/(sub), this functions redirects client to main page */
router.get(['/projects', '/contact'], isAuthenticated, (req,res) =>{
    res.redirect('/');
})

router.get('/:file.json', isAuthenticated, (req,res) =>{
    res.sendFile(path.join(__dirname, 'data', 'json', req.params.file+'.json'));
})

router.get('/:file.jpg', isAuthenticated, (req,res) =>{
    res.sendFile(path.join(__dirname, 'data', 'image', req.params.file+'.jpg'));
})

router.post('/login',
            (req, res, next)=>{
              console.log(req.connection.remoteAddress, "attempts to connect!");
              next();
            },
            passport.authenticate('local', {
              successRedirect: '/',
              failureRedirect: '/login',
            })
);







/* not active */
router.get('/logout', isAuthenticated, (req, res) =>{
    req.logout();
    console.log('[passport] logout');
    res.redirect('/login');
});

/* not active */
router.post('/register', (req,res, next) =>{
  
  Users.findOne({ id: req.body.id }, (findError, user) => {
      	if (findError) {
          throw findError;
      	}
      	
      	if (user)
          return user;

        return undefined;
  })
  .then( (user)=>{
      if (user){
        /*req.flash('error', '이미 존재하는 아이디입니다')*/
        res.redirect('/login');
      }
      else{
        const reg_user = new Users();

        reg_user.id = req.body.id;
        reg_user.pw = encrypt(req.body.pw);
        reg_user.save();

        console.log(`user ${req.body.id} is added!`);

        /*req.flash('error', '가입 완료되었습니다 : ' + req.body.id);*/
        res.redirect('/login');
      }
    })
  .catch(err => alert(err));

})

module.exports = router;