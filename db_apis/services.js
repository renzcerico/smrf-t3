const oracledb = require('oracledb');
const database = require('../services/database.js');

const get = async () => {
    const sql = `SELECT
                    st.*,
                    sr.REP_NAME
                 FROM ${ process.env.SCHEMA }.XX_SR_TYPES st
                 LEFT JOIN ${ process.env.SCHEMA}.XX_SR_REPRESENTATIVES sr ON sr.rep_id = st.rep_id`;

    const result = await database.simpleExecute(sql);

    return result.rows;
};

module.exports.get = get;

const insert = async (data) => {
    const sql = `INSERT INTO ${ process.env.SCHEMA }.XX_SR_TYPES 
                    (SR_TYPE_ID, SR_TYPE_CODE, SR_TYPE_NAME, REP_ID)
                VALUES(null, :code, :name, :dept)`;

    const bind = {
        'code': data.services_code,
        'name': data.services_name,
        'dept': parseInt(data.services_deparment)
    };

    const result = await database.simpleExecute(sql, bind);

    return result.rows;
};

module.exports.insert = insert;

const getByID = async (id) => {
    const sql = `SELECT
                    st.*,
                    sr.REP_NAME,
                    sr.REP_ID
                 FROM ${ process.env.SCHEMA }.XX_SR_TYPES st
                    LEFT JOIN ${ process.env.SCHEMA }.XX_SR_REPRESENTATIVES sr ON sr.rep_id = st.rep_id
                 WHERE st.SR_TYPE_ID = :id`;

    const bind = {
        id
    };

    const result = await database.simpleExecute(sql, bind);

    return result.rows;
};

module.exports.getByID = getByID;

const update = async (data) => {
    const sql = `UPDATE ${ process.env.SCHEMA }.XX_SR_TYPES
                    SET SR_TYPE_CODE = :code,
                        SR_TYPE_NAME = :name,
                        REP_ID = :department
                WHERE SR_TYPE_ID = :id`;

    const result = await database.simpleExecute(sql, data);

    return result;
};

module.exports.update = update;