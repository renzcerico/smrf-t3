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

const insert = async (data) => {
    const sql = `INSERT INTO ${ process.env.SCHEMA }.XX_SR_REPRESENTATIVES
                    (REP_ID, REP_CODE, REP_NAME, PERSON_ID, DEPT_ID)
                VALUES
                    (null, :code, :departmentName, :representativeID, :departmentID)`;
    
    const bind = {
        code: data.departmentCode,
        departmentName: data.department,
        representativeID: parseInt(data.representativeID),
        departmentID: parseInt(data.departmentID)
    };

    const result = await database.simpleExecute(sql, bind);

    return result.rows;
};

module.exports.insert = insert;

const update = async (data) =>{
    const sql = `UPDATE ${ process.env.SCHEMA }.XX_SR_REPRESENTATIVES
                    SET REP_CODE = :rep_code,
                        REP_NAME = :rep_name,
                        PERSON_ID = :representativeID
                WHERE REP_ID = :id
                `;

    const bind = {
        rep_code: data.departmentCode,
        rep_name: data.department,
        representativeID: parseInt(data.representativeID),
        id: parseInt(data.id)
    };

    const result = await database.simpleExecute(sql, bind);

    return result;
};

module.exports.update = update;