/* call dbhelper.pwgen with id & pw arguments */
/* command line : node pwgen.js */

const dbhelper = require('./pwgen_db.js');
dbhelper.pwgen('your-id', 'your-pw');