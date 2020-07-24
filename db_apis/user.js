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
                    CONCAT(
                        CONCAT(last_name, ', '), first_name) name,
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

const deleteUser = async (id) => {
    
    const bind = {
        id
    };

    // const sql = `DELETE FROM ${ process.env.SCHEMA }.TBL_DEPARTMENT WHERE ID = :id`;
    const sql = `BEGIN 
                    DELETE FROM ${ process.env.SCHEMA }.TBL_USER WHERE ID = :id;
                    COMMIT;
                END;`;
    
    const result = await database.simpleExecute(sql, bind);

    return result;
};

module.exports.deleteUser = deleteUser;

const getByID = async (id) => {
    const sql = `SELECT
                    id,
                    last_name,
                    first_name,
                    middle_name,
                    username,
                    user_level,
                    TO_NUMBER(department) department
                 FROM ${ process.env.SCHEMA }.TBL_USER
                 WHERE ID = :id`;

    const bind = {
        id
    };

    const result = await database.simpleExecute(sql, bind);

    return result.rows;
};

module.exports.getByID = getByID;

const update = async (data) => {
    const sql = `UPDATE ${ process.env.SCHEMA }.TBL_USER 
                    SET LAST_NAME   = :last_name,
                        FIRST_NAME  = :first_name,
                        MIDDLE_NAME = :middle_name,
                        USERNAME    = :username,
                        USER_LEVEL  = :user_level,
                        DEPARTMENT  = :department
                WHERE ID = :id`;

    const user = Object.assign({}, data);
    const result = await database.simpleExecute(sql, user);

    return result;
};

module.exports.update = update;