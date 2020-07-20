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