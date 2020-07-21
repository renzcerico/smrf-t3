const oracle = require('oracledb');
const database = require('../services/database.js');

const insert = async (data) => {
    const sql = `INSERT INTO ${ process.env.SCHEMA }.TBL_USER 
                (LAST_NAME, FIRST_NAME, MIDDLE_NAME, USERNAME, PASSWORD, USER_LEVEL, DEPARTMENT) 
                VALUES 
                (:last_name, :first_name, :middle_name, :username, 'welcome', :user_level, :department)`;

    const user = Object.assign({}, data);
    const result = await database.simpleExecute(sql, user);

    return result;
};

module.exports.insert = insert;

const getAllUser = async () => {
    const sql = `SELECT
                    id as user_id,
                    last_name,
                    first_name,
                    middle_name,
                    username,
                    user_level,
                    (SELECT name FROM ${ process.env.SCHEMA }.TBL_DEPARTMENT WHERE ID = department) department_name,
                    department as department_id 
                 FROM ${ process.env.SCHEMA }.TBL_USER
                 ORDER BY TO_NUMBER(DEPARTMENT) ASC`;

    const result = await database.simpleExecute(sql);

    return result.rows;
};

module.exports.getAllUser = getAllUser;

const deleteUser = async (data) => {
    const id = data.id;
    const apiKey = data.apiKey;
    
    const sql = `DELETE FROM ${ process.env.SCHEMA }.TBL_USER WHERE ID = :id`;
    
    const result = await database.simpleExecute(sql, id);

    return 200;
};

module.exports.deleteUser = deleteUser;