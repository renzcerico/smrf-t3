const oracledb = require('oracledb');
const database = require('../services/database.js');

const sql = 
    `BEGIN MY_PKG.get_representatives(null, :cursor ); END;`;

const representative = async () => {

    const binds = {};
    
    binds.cursor = {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR
      }
    
      const result = await database.resultsetExecute(sql, binds);
     
      return result;    
};

module.exports.representative = representative;