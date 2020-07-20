const oracledb = require('oracledb');
const database = require('../services/database.js');
 
const baseQuery = `BEGIN MY_PKG.get_personnel(:filter_by, :cursor ); END;`; 
 
async function find(context) {
  
  let query = baseQuery;

  const binds = {};

  if (context.search) {
    binds.filter_by = context.search;
  }

  binds.cursor = {
    dir: oracledb.BIND_OUT,
    type: oracledb.CURSOR
  }

  const result = await database.resultsetExecute(query, binds);
 
  return result;
  
}
 
module.exports.find = find;

const getApprover = async (department) => {

    const sql = `BEGIN MY_PKG.get_approver(:dept, :cursor); END;`;

    const binds = {
        dept: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(department)
        },
        cursor: {
            type: oracledb.CURSOR,
            dir: oracledb.BIND_OUT
        }
    };
  
    const result = await database.resultsetExecute(sql, binds);
    return result;
};

module.exports.getApprover = getApprover;

const getAllUser = async (dept) => {
    const sql = `SELECT 
                    ID,
                    CONCAT(CONCAT(LAST_NAME, ', '), FIRST_NAME) FULL_NAME
                 FROM ${process.env.SCHEMA}.tbl_user WHERE department = :dept`;
    
      // const sql = `SELECT 
      //             ID,
      //             CONCAT(CONCAT(LAST_NAME, ', '), FIRST_NAME) FULL_NAME
      //           FROM tbl_user WHERE department = :dept`;
    const binds = {
        dept: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: parseInt(dept)
        }
    };

    const result = await database.simpleExecute(sql, binds);

    return result.rows;
}

module.exports.getAllUser = getAllUser;

const getChiefByDept = async (dept) => {
  const sql = `SELECT 
                  ID,
                  CONCAT(CONCAT(LAST_NAME, ', '), FIRST_NAME) FULL_NAME
               FROM ${process.env.SCHEMA}.tbl_user WHERE department = :dept AND user_level = 'chief'`;
  const binds = {
      dept: {
        type: oracledb.NUMBER,
        dir: oracledb.BIND_IN,
        val: parseInt(dept)
      }
  };

  const result = await database.simpleExecute(sql, binds);

  return result.rows;
}

module.exports.getChiefByDept = getChiefByDept;