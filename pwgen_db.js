const Users = require('./user.js');
const connectdb = require('./db.js');

/* crypto func */
const {encrypt, decrypt} = require('./crypto.js');

pwgen = (id, pw) => {

	connectdb();

	Users.findOne({ id: id }, (findError, user) => {
	      	if (findError) {
	      		console.log(' ');
	      		console.log('Find error!');
	          	throw findError;
	      	}

	      	if (user)
	          return user;

	        return undefined;
	  })
	  .then( (user)=>{
	      if (user){
	      	console.log(' ');
			console.log('ID', id ,'already exists.');
			process.exit(1);
	      }
	      else{
	        const reg_user = new Users();

	        reg_user.id = id;
	        reg_user.pw = encrypt(pw);
	        reg_user.save().then(()=>{
	        	console.log(' ');

				console.log(`user ${id} is added!`);

		        console.log('ID : ', id);
		        console.log('PW : ', pw);
		        process.exit(1);
	        });
	      }
	    })
	  .catch(err => {
	  	alert(err);
	  	process.exit(1);
	  });
}

module.exports = {
	pwgen,
};