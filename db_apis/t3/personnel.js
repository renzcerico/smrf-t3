const oracledb = require('oracledb');
const database = require('../../services/database.js');
 
const baseQuery = 
    `BEGIN MY_PKG.get_personnel(:filter_by, :cursor ); END;`;
 
async function find() {
  
  let query = baseQuery;
  const binds = {};

  binds.filter_by = '';

  binds.cursor = {
    dir: oracledb.BIND_OUT,
    type: oracledb.CURSOR
  }

  const result = await database.resultsetExecute(query, binds);
 
  return result;
  
}
 
module.exports.find = find;