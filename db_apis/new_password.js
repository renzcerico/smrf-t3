const oracledb = require('oracledb');
const database = require('../services/database.js');
 
const loginSql =
 `begin my_pkg.change_password(:user, :pass, :bv); end;`;

async function setPassword(log) {

  const login = Object.assign({}, log);

  login.bv = {
    dir: oracledb.BIND_OUT,
    type: oracledb.CHAR
  }

  const result = await database.simpleExecute(loginSql, login);

  login.bv = result.outBinds.bv[0];
  
  return login;
}

module.exports.setPassword = setPassword;

