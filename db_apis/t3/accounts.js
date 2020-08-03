const oracledb = require('oracledb');
const database = require('../../services/database.js');


const insert = async (data) => {
    const sqlInsert = "BEGIN " + process.env.SCHEMA + ".T3_PACKAGE.INSERT_ACCOUNTS(:accounts, :id); END;";
    // const accounts = Object.assign({}, data);
    let connect = await oracledb.getConnection();
    const acctObj = await connect.getDbObjectClass(process.env.SCHEMA + '.ACCOUNT_OBJ')
    const accounts = new acctObj(data);

    const binds = {
        accounts: accounts,
        id: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER
        }
    };

    return new Promise((resolve, reject) => {
        database.simpleExecute(sqlInsert, binds).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        }).finally(() => {
            connect.close();
        }) 
    });
};

module.exports.insert = insert;


const all = async (data) => {
    const sqlGetAll = "BEGIN " + process.env.SCHEMA + ".T3_PACKAGE.GET_ALL_ACCOUNTS(:show_count, :page_number, :search_val, :order_by, :order_order, :cursor, :counter); END;";
    const binds = data;
    
    binds.cursor = {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR
    }

    binds.counter = {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR
    }

    const result = await database.resultsetExecute(sqlGetAll, binds);

    return result;
};

module.exports.all = all;


const getManpowerList = async () => {
    const sqlGetManpowerList = "BEGIN " + process.env.SCHEMA + ".T3_PACKAGE.GET_MANPOWER_LIST(:cursor); END;";
    const binds = {};
    
    binds.cursor = {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR
    }

    const result = await database.resultsetExecute(sqlGetManpowerList, binds);

    return result;
};

module.exports.getManpowerList = getManpowerList;


const getById = async (id) => {
    const sqlGetById = "BEGIN " + process.env.SCHEMA + ".T3_PACKAGE.GET_ACCOUNT_BY_ID(:id, :cursor); END;";
    let binds = {};
    
    binds = {
        id: {
            dir: oracledb.BIND_IN,
            type: oracledb.NUMBER,
            val: parseInt(id)
        },
        cursor: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR
        }
    }

    const result = await database.resultsetExecute(sqlGetById, binds);

    return result;
};

module.exports.getById = getById;


const resetPassword = async (id) => {
    const sqlResetPassword = `BEGIN ${process.env.SCHEMA}.T3_PACKAGE.RESET_PASSWORD(:id, :output); END;`;
    const binds = {
        id: {
            dir: oracledb.BIND_IN,
            type: oracledb.NUMBER,
            val: parseInt(id)
        },
        output: {
            dir: oracledb.BIND_OUT,
            type: oracledb.VARCHAR
        }
    };

    const result = await database.simpleExecute(sqlResetPassword, binds);

    return result;
};

module.exports.resetPassword = resetPassword;