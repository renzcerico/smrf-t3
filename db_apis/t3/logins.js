const oracledb = require('oracledb');
const database = require('../../services/database.js');
 

async function setlogin(log) {
  
  const loginSql =
   `begin ${process.env.SCHEMA}.T3_PACKAGE.validate_user(:user, :pass, :cursor); end;`;
  const login = Object.assign({}, log);

  login.cursor = {
    dir: oracledb.BIND_OUT,
    type: oracledb.CURSOR
  }

  const result = await database.resultsetExecute(loginSql, login);
  
  return result;
}

module.exports.setlogin = setlogin;


const forwardList = async (userLevel) => {
  const forwardListSql = `BEGIN ${process.env.SCHEMA}.T3_PACKAGE.FORWARD_LIST(:userLevel, :cursor); END;`;
  const bind = {
    userLevel: userLevel.toLowerCase(),
    cursor: {
      dir: oracledb.BIND_OUT,
      type: oracledb.CURSOR
    }
  };

  const result = await database.resultsetExecute(forwardListSql, bind);

  return result;
};

module.exports.forwardList = forwardList;