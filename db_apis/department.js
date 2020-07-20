const oracledb = require('oracledb');
const database = require('../services/database.js');
const { BIND_OUT, BIND_IN } = require('oracledb');


// const sql = `SELECT 
//                  id, 
//                  name
//              FROM tbl_department`;

const getDepartment = async () => {
    const sql = `SELECT 
                    td.id, 
                    td.name, 
                    td.status,
                    sr.PERSON_ID,
                    CASE WHEN tu.LAST_NAME IS NULL
                        THEN '' 
                        ELSE CONCAT(CONCAT(tu.LAST_NAME, ', '), tu.FIRST_NAME)
                    END as rep_name
                FROM ${ process.env.SCHEMA }.tbl_department td
                LEFT JOIN xx_sr_representatives sr ON sr.dept_id = td.id
                LEFT JOIN tbl_user tu ON tu.id = sr.PERSON_ID`;
    const result = await database.simpleExecute(sql);

    return result.rows;
};

module.exports.getDepartment = getDepartment;

const insert = async (dept) => {
    dept = dept.toUpperCase();

    const sql = `INSERT INTO ${ process.env.SCHEMA }.TBL_DEPARTMENT
                 (ID, NAME, STATUS)
                 VALUES
                 (null, :dept, null)
                 returning ID INTO :dept_id`;

    const bind = {
        dept,
        dept_id: {
            dir: oracledb.BIND_OUT
        }
    };

    const result = await database.simpleExecute(sql, bind);

    return result.outBinds;
};

module.exports.insert = insert;