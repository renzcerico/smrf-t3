const oracledb = require('oracledb');
const database = require('../services/database.js');

// const sql = `SELECT 
//                     xst.sr_type_id, 
//                     xst.sr_type_name 
//                 FROM xx_sr_types xst
//                 WHERE xst.rep_id = :department`;

const requestList = async (dept) => {
    const sql = `SELECT 
                    xst.sr_type_id, 
                    xst.sr_type_name 
                FROM ${process.env.SCHEMA}.xx_sr_types xst
                WHERE xst.rep_id = :department`;
    const result = await database.simpleExecute(sql, dept);
    // console.log(dept);
    // console.log(result);
    return result.rows;
};

module.exports.requestList = requestList;