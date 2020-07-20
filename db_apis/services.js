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
        'code': data.service_code,
        'name': data.service_name,
        'dept': parseInt(data.service_deparment)
    };

    const result = await database.simpleExecute(sql, bind);

    return result.rows;
};

module.exports.insert = insert;