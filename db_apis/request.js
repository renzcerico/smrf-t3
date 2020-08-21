const oracledb = require('oracledb');
const database = require('../services/database.js');

const all = async () => {
    const sql = `BEGIN MY_PKG.get_all_request(:cursor); END;`;
    
    const bind = {
        cursor: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR
        }
    };
    console.log('\x1b[31m', process.env.SCHEMA, '\x1b[0m');
    const result = await database.resultsetExecute(sql, bind);
    return result;
};

module.exports.all = all;

const allById = async (req) => {
    const sql = `BEGIN MY_PKG.get_all_request_by_user(:id, :cursor); END;`;
    
    const bind = {
        id: {
            dir: oracledb.BIND_IN,
            type: oracledb.NUMBER,
            val: parseInt(req.params.id)
        },
        cursor: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR
        }
    };

    const result = await database.resultsetExecute(sql, bind);
    return result;
};

module.exports.allById = allById;

const getRequestById = async (id) => {
    const sql = `BEGIN MY_PKG.get_requests(:r_id, :cursor); END;`;

    const bind = {
        r_id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(id.id)
        },
        cursor: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR
        }
    };

    const result = await database.resultsetExecute(sql, bind);

    return result;
};

module.exports.getRequestById = getRequestById;

const getRequestDetailsById = async (id) => {
    const sql = `BEGIN MY_PKG.get_request_details(:r_id, :cursor); END;`;

    const bind = {
        r_id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(id.id)
        },
        cursor: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR
        }
    };

    const result = await database.resultsetExecute(sql, bind);

    return result;
};
module.exports.getRequestDetailsById = getRequestDetailsById;

const getRequestAttachmentsById = async (id) => {
    const sql = `BEGIN MY_PKG.get_request_attachments(:r_id, :cursor); END;`;

    const bind = {
        r_id: id,
        cursor: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR
        }
    };

    const result = await database.resultsetExecute(sql, bind);

    return result;
};

module.exports.getRequestAttachmentsById = getRequestAttachmentsById;

const updateStatus = async (data) => {

    const sql = `BEGIN 
                    MY_PKG.update_requests (:r_id, :r_notes, :r_status, :output);
                END;`
    
    const binds = {
        r_id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(data.body.req_id)
        },
        r_notes: {
            type: oracledb.VARCHAR,
            dir: oracledb.BIND_IN,
            val: data.body.req_notes
        },
        r_status: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(data.body.req_status)
        },
        output: {
            dir: oracledb.BIND_OUT,
            type: oracledb.VARCHAR
        }
    };

    const result = await database.simpleExecute(sql, binds);
    console.log(result);
    return result;
};

module.exports.updateStatus = updateStatus;

const updateRequestDetails = async (data) => {
    const sql = `BEGIN MY_PKG.update_request_details(:reqArr, :output); END;`;
    const reqDetails = [];

    let connect;
    connect = await oracledb.getConnection();
    const T_RECTYPE = await connect.getDbObjectClass( process.env.SCHEMA + '.T_RECTYPE');

    data.body.forEach(element => {
        const json = {
            REQ_DTL_ID: element.DTL_ID,
            REQ_REMARKS: element.DTL_REMARKS,
            SR_TYPE_ID: element.DTL_SR_TYPE_ID
        };

        reqDetails.push(json);
    });
    const binds = {
        reqArr: {
            type: T_RECTYPE,
            dir: oracledb.BIND_IN,
            val: reqDetails
        },
        output: {
            type: oracledb.VARCHAR,
            dir: oracledb.BIND_OUT
        }
    };

    return new Promise((resolve, reject) => {
        database.simpleExecute(sql, binds)
        .then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        }).finally(() => {
            connect.close();
        });
    });
};

module.exports.updateRequestDetails = updateRequestDetails;

const transfer = async (data) => {
    const sql = `BEGIN MY_PKG.transfer_request(:id, :person_id, :output); END;`;

    binds = {
        id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(data.body.req_id)
        },
        person_id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(data.body.req_person_id)          
        },
        output: {
            dir: oracledb.BIND_OUT,
            type: oracledb.VARCHAR
        }
    };

    console.log(binds);
    const result = await database.simpleExecute(sql, binds);
    return result;
};

module.exports.transfer = transfer;

const deleteRequest = async (id) => {
    const sql = `BEGIN 
                    DELETE FROM ${ process.env.SCHEMA }.tblrequests where req_id = :id;
                    DELETE FROM ${ process.env.SCHEMA }.tblrequests_dtl where req_id = :id;
                    COMMIT;
                END;`;
    
    const bind = {
        id
    };

    const result = await database.simpleExecute(sql, bind);

    return result;
};

module.exports.deleteRequest = deleteRequest;