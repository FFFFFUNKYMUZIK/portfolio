/* refers to https://www.zerocho.com/category/NodeJS/post/57b7101ecfbef617003bf457 */
/* https://stackoverflow.com/questions/60369148/how-do-i-replace-deprecated-crypto-createcipher-in-nodejs */

/* passport */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/* UserDB(mongoose) */
const Users = require('./user.js');
const only_id = 'viewer';

/* passport config func */
module.exports = () => {
  passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨, 로그인 성공 시 단 한번
    //console.log('serialize');
    done(null, user.id); // 세션에 user.id 저장
  });

  passport.deserializeUser((user, done) => { // serializeUser에서 세션에 저장한 id값이 user 변수로 들어옴 
    //console.log('deserialize'); 
    Users.findOne({ id: user }, (err, user) => { //검색
      done(null, user); // 찾은 후 찾은 객체를 req.user 변수에 저장해줌
    });
  });

  passport.use(new LocalStrategy({ // local 전략을 세움
    usernameField: 'id',
    passwordField: 'pw',
    session: true, // 세션에 저장 여부
    passReqToCallback: false,
  }, (id, password, done) => {

    console.log('[passport] login processing...');

    Users.findOne({ id: only_id }, (findError, user) => {
      if (findError) {
        console.log('db error');
        return done(findError); // 서버 에러 처리
      }
      if (!user){
        console.log('no user');
        return done(null, false, { message: '존재하지 않는 아이디입니다' }); // 임의 에러 처리
      }
      return user.comparePassword(password, (passError, isMatch) => {
        if (isMatch) {
          return done(null, user); // 검증 성공
        }
        console.log('invalid password');
        return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리
      });
    });
  }));
};