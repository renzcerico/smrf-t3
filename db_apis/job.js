const oracledb = require('oracledb');
const database = require('../services/database.js');
const moment = require('moment'); 

const create = async (data) => {
    const sql = `BEGIN 
                    MY_PKG.create_job_order(:r_id, 
                                            :issued_to, 
                                            :comp_date, 
                                            :work_req,
                                            :status_report,
                                            :date_started,
                                            :date_finished,
                                            :total_downtime,
                                            :notes,
                                            :findings,
                                            :completed, 
                                            :manpower,
                                            :output); 
                END;`;

    let connect;
    connect = await oracledb.getConnection();
    const T_MANPOWER = await connect.getDbObjectClass(process.env.SCHEMA + '.T_MANPOWER');
    // const T_MANPOWER = await connect.getDbObjectClass("T_MANPOWER");

    const binds = {
        r_id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(data.body.id)
        },
        issued_to: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: data.body.issued_to ? parseInt(data.body.issued_to) : null
        },
        comp_date: {
            type: oracledb.VARCHAR,
            dir: oracledb.BIND_IN,
            val: moment(data.body.estimated_date).format('YYYY/MM/DD 00:00:00').toString()
        },
        work_req: {
            type: oracledb.VARCHAR,
            dir: oracledb.BIND_IN,
            val: data.body.work_required
        },
        status_report: {
            type: oracledb.VARCHAR,
            dir: oracledb.BIND_IN,
            val: data.body.status_report
        },
        date_started: data.body.date_started,
        date_finished: data.body.date_finished,
        // date_started: moment(data.body.date_started).format('YYYY/MM/DD HH:mm:ss'),
        // date_finished: moment(data.body.date_finished).format('YYYY/MM/DD HH:mm:ss'),
        total_downtime: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(data.body.total_downtime) || 0
        },
        notes: {
            type: oracledb.STRING,
            dir: oracledb.BIND_IN,
            val: data.body.notes
        },
        findings: {
            type: oracledb.STRING,
            dir: oracledb.BIND_IN,
            val: data.body.findings
        },
        completed: {
            type: oracledb.STRING,
            dir: oracledb.BIND_IN,
            val: data.body.completed.toString()
        },
        manpower: {
            type: T_MANPOWER,
            dir: oracledb.BIND_IN,
            val: data.body.manpower
        },
        output: {
            type: oracledb.STRING,
            dir: oracledb.BIND_OUT
        }
    };
    
    // const result = await database.simpleExecute(sql, binds);

    // return result;
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

module.exports.create = create;

const completed = async (data) => {
    const sql = `BEGIN MY_PKG.request_completed(:r_id, :r_acceptance, :output); END;`;

    const binds = {
        r_id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(data.body.id)
        },
        r_acceptance: {
            type: oracledb.VARCHAR,
            dir: oracledb.BIND_IN,
            val: data.body.acceptance
        },
        output: {
            type: oracledb.VARCHAR,
            dir: oracledb.BIND_OUT
        }
    };

    const result = await database.simpleExecute(sql, binds);

    return result;
};

module.exports.completed = completed;

const getJob = async (id) => {
    const sql = `SELECT j.*,
                        r.REQ_STATUS,
                        r.REP_PERSON_ID,
                        r.APPROVED_BY,
                        r.CREATED_BY as REQ_CREATED_BY,
                        (SELECT CONCAT(CONCAT(u.last_name, ', '), u.first_name) 
                            FROM ${process.env.SCHEMA}.tbl_user u
                            WHERE u.id = DECODE(j.issued_to, null, r.rep_person_id, j.issued_to)) as NAME_ISSUED_TO
                    FROM ${process.env.SCHEMA}.tbl_job_order j
                            INNER JOIN ${process.env.SCHEMA}.tblrequests r ON j.request_id = r.req_id 
                    WHERE request_id = :id`;
    
    const sqlManpower = `SELECT m.id,
                                m.manpower_id M_ID,
                                m.remarks,
                                CONCAT( CONCAT(u.LAST_NAME, ', '), u.FIRST_NAME ) name,
                                CASE
                                    WHEN m.id > 0 THEN 'false'
                                    ELSE 'true'
                                END is_new
                            FROM ${process.env.SCHEMA}.tbl_manpower m
                            LEFT JOIN ${process.env.SCHEMA}.tbl_user u ON u.id = m.manpower_id
                            WHERE m.job_order_id IN (SELECT jo.id FROM ${process.env.SCHEMA}.tbl_job_order jo WHERE jo.request_id = :id)`;

    const binds = {
        id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(id)
        }
    };

    const result = await database.simpleExecute(sql, binds);
    const resManpower = await database.simpleExecute(sqlManpower, binds);

    const json = {
        jobs_order: result.rows,
        manpower: resManpower.rows
    }
    return json;
};

module.exports.getJob = getJob;

const all = async () => {
    const sql = `BEGIN MY_PKG.get_all_job(:cursor); END;`;
    
    const bind = {
        cursor: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR
        }
    };

    const result = await database.resultsetExecute(sql, bind);
    return result;
};

module.exports.all = all;

const getAllJobsById = async (id) => {
    const sql = `BEGIN MY_PKG.get_all_job_by_user(:u_id, :cursor); END;`;
    
    const bind = {
        u_id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(id)
        },
        cursor: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR
        }
    };

    
    const result = await database.resultsetExecute(sql, bind);
    return result;
};

module.exports.getAllJobsById = getAllJobsById;