const oracle = require('oracledb');
const database = require('../../services/database.js');

const storeAll = async (data) => {
    let connect;
    try {
        connect = await oracle.getConnection();
        const query = `begin ${process.env.SCHEMA}.T3_PACKAGE.STORE_ALL(
                    :header_obj
                    , :activity_data
                    , :manpower_data
                    , :material_data
                    , :user_id
                    , :output
                );
            end;`;
        const headerObj = await connect.getDbObjectClass(process.env.SCHEMA + '.HEADER_OBJ')
        .catch(error => { console.log('caught', error.message); });
        const header_obj = new headerObj(data.header_obj);
        const activityCollection = await connect.getDbObjectClass(process.env.SCHEMA + '.ACTIVITY_COLLECTION')
        .catch(error => { console.log('caught', error.message); });
        const activity_data = new activityCollection(data.activity_collection);
        const manpowerCollection = await connect.getDbObjectClass(process.env.SCHEMA + '.MANPOWER_COLLECTION')
        .catch(error => { console.log('caught', error.message); });
        const manpower_data = new manpowerCollection(data.manpower_collection);
        const materialCollection = await connect.getDbObjectClass(process.env.SCHEMA + '.MATERIAL_COLLECTION')
        .catch(error => { console.log('caught', error.message); });
        const material_data = new materialCollection(data.material_collection);

        let binds = {
            header_obj: header_obj,
            activity_data: activity_data,
            manpower_data: manpower_data,
            material_data: material_data,
            user_id: data.user_id,
            output: {
                dir: oracle.BIND_OUT,
                type: oracle.NUMBER
            }
        }
        console.log(binds.header_obj);
        const result = await connect.execute(query, binds, {autoCommit: true})
        .catch(error => { console.log('caught', error.message); });
        return result.outBinds.output;
    } catch (err) {
        console.log(err);
    } finally {
        if (connect) {
            connect.close();
        }
    }
}

module.exports.storeAll = storeAll;


const getAllByBarcode = async (data) => {
    const header_q = 'begin ' + process.env.SCHEMA + '.T3_PACKAGE.GET_HEADER_BY_BARCODE ( :barcode, :cursor); end;';
    let header_binds = {
        barcode: data,
    }

    header_binds.cursor = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }

    const header_res = await database.resultsetExecute(header_q, header_binds)
        .catch(error => { console.log('caught', error.message); });
    let res = {};
    if (header_res.length > 0) {
        const activities = await getDataByHeaderId(process.env.SCHEMA + '.TBL_ACTIVITY' , header_res[0].ID);
        const manpower = await getDataByHeaderId(process.env.SCHEMA + '.TBL_T3_MANPOWER' ,  header_res[0].ID);
        const materials = await getDataByHeaderId(process.env.SCHEMA + '.TBL_MATERIAL' ,  header_res[0].ID);
        res = {
            header_obj          : header_res[0],
            activity_collection : activities,
            manpower_collection : manpower,
            materials_collection : materials,
        }
    }
    return res;
}

module.exports.getAllByBarcode = getAllByBarcode;

const getDataByHeaderId = async (table ,headerid) => {
    const q = `begin ${process.env.SCHEMA}.T3_PACKAGE.GET_DATA_BY_HEADER_ID ( :header_id, :table, :cursor ); end;`;
    let binds = {
        header_id: headerid,
        table: table
    };
    binds.cursor = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }
    let res = await database.resultsetExecute(q, binds)
    .catch(error => { console.log('caught', error.message); });
    if (table == process.env.SCHEMA + '.TBL_ACTIVITY') {
        for ( let i = 0; i <= res.length - 1; i++ ){
            let activity_details = await getActivityDetails(res[i].ID).then(res => {
                return res;
            });
            let activity_downtime = await getActivityDowntime(res[i].ID).then(res => {
                return res;
            });
            res[i].ACTIVITY_DETAILS = activity_details;
            res[i].ACTIVITY_DOWNTIME = activity_downtime;
        };
    }
    return res;
}

const getActivityDetails = async (activity_id) => {
    const q = `begin ${process.env.SCHEMA}.T3_PACKAGE.GET_ACTIVITY_DETAILS ( :activity_id, :cursor ); end;`;
    let binds = {
        activity_id: activity_id,
    };
    binds.cursor = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }
    const res = await database.resultsetExecute(q, binds)
    .catch(error => { console.log('caught', error.message); });
    return res;
}

const getActivityDowntime = async (activity_id) => {
    const q = `begin ${process.env.SCHEMA}.T3_PACKAGE.GET_ACTIVITY_DOWNTIME ( :activity_id, :cursor ); end;`;
    let binds = {
        activity_id: activity_id,
    };
    binds.cursor = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }
    const res = await database.resultsetExecute(q, binds)
    .catch(error => { console.log('caught', error.message); });
    return res;
}

const getDowntimeTypes = async () => {
    const q = `BEGIN ${process.env.SCHEMA}.T3_PACKAGE.GET_DOWNTIME_TYPES (:cursor); END;`;
    // const q = `
    //     BEGIN
    //         OPEN :cursor FOR
    //         SELECT dt.*
    //         FROM ${process.env.SCHEMA}.tbl_downtime_types dt;
    //     END;
    // `;
    let binds = {
        cursor: {
            dir: oracle.BIND_OUT,
            type: oracle.CURSOR
        }
    }
    let res = await database.resultsetExecute(q, binds)
    .catch(error => { console.log('caugth', error.message)});
    consoleSuccess(res);
    return res;
}

module.exports.getDowntimeTypes = getDowntimeTypes;

const getHeaderCountPerStatus = async (isLoggedIn) => {
    let q = `BEGIN ${process.env.SCHEMA}.T3_PACKAGE.GET_HEADER_COUNT_PER_STATUS (:isLoggedIn, :cursor); END;`;

    let binds = {
        isLoggedIn: isLoggedIn,
        cursor: {
            dir: oracle.BIND_OUT,
            type: oracle.CURSOR
        }
    }
    let res = await database.resultsetExecute(q, binds)
    .catch(error => { console.log('caugth', error.message)});
    return res;
}

module.exports.getHeaderCountPerStatus = getHeaderCountPerStatus;

const getHeaderByStatus = async (data) => {
    const header_q = `begin ${process.env.SCHEMA}.T3_PACKAGE.GET_HEADER_BY_STATUS ( :status_code, :user_id, :show_count, :page_number, :search_val, :order_by, :order_order, :cursor, :counter); end;`;
    let header_binds = data;
    header_binds.cursor = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }

    header_binds.counter = {
        dir: oracle.BIND_OUT,
        type: oracle.CURSOR
    }

    const header_res = await database.resultsetExecute(header_q, header_binds)
        .catch(error => { console.log('caught', error.message); });
    let res = {};
    return header_res;
}

module.exports.getHeaderByStatus = getHeaderByStatus;

const getServerTime = async () => {
    const q = `begin ${process.env.SCHEMA}.T3_PACKAGE.GET_SERVER_TIME (:cursor); end;`;
    let binds ={
        cursor : {
            dir: oracle.BIND_OUT,
            type: oracle.CURSOR
        }
    }

    const res = await database.resultsetExecute(q, binds)
        .catch(error => { console.log('caught', error.message); });
    const time = res[0].NOW;
    return time;
}

module.exports.getServerTime = getServerTime;


const changePassword = async (data) => {
    const q = `begin ${process.env.SCHEMA}.T3_PACKAGE.CHANGE_PASSWORD (:user_id, :old_password, :new_password, :status); end;`;
    let binds = data;
    binds.status = {
        dir: oracle.BIND_OUT,
        type: oracle.DB_TYPE_CHAR
    }
    consoleSuccess(binds);
    const res = await database.simpleExecute(q, binds)
        .catch(error => { console.log('caught', error.message); });
    return parseInt(res.outBinds.status, 10);
}

module.exports.changePassword = changePassword;

const createDowntimeTypes = async (downtime_type) => {
    const q = `
        BEGIN
                INSERT INTO ${process.env.SCHEMA}.tbl_downtime_types
                VALUES (
                    NULL,
                    :downtime_type,
                    0,
                    NULL
                );
            COMMIT;
        END;
        `;
    let binds = {
        downtime_type
    };
    // consoleSuccess(binds);
    let res = await database.simpleExecute(q, binds)
        .catch(error => { console.log('caught', error.message); });
    // consoleSuccess(res);
    return res;
}

module.exports.createDowntimeTypes = createDowntimeTypes;

const consoleError = (text) => {
    console.log('\x1b[47m','\x1b[31m', text, '\x1b[0m');
}


const consoleSuccess = (text) => {
    console.log('\x1b[32m', text, '\x1b[0m');
}