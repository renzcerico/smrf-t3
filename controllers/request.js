const request   = require('../db_apis/request.js');
const session   = require('express-session');
const oracledb  = require('oracledb');
const database  = require('../services/database.js');
const fs        = require('fs');
const { default: mailer } = require('../services/email/mailer.js');
const nodemailer = require('../services/email/mailer');

const requestData = (req) => {
    // const loggedIn = req.session.username;
    // const user = loggedIn.split('|');
    const requestID = [];
    const requestRemarks = [];

    req.body.reqDetails.forEach(element => {
        requestID.push(parseInt(element.request));
        requestRemarks.push(element.remarks);
    });

    const data = {     
        date_required: req.body.reqDateRequired,
        machine: req.body.reqMachine,
        department: req.body.reqDepartment,
        notes: req.body.reqNotes,
        request_id: requestID,
        request_remarks: requestRemarks,
        status: 'pending',
        created_by: req.body.created_by,
        recipient: parseInt(req.body.reqRecipient),
        reviewed_by: 0,
        approved_by: 0,
        date_reviewed: null,
        date_approved: null,
        updated_at: null,
        priority: req.body.reqPriority
    };

    const data2 = { request_id: requestID }

    return data2;
};

const requestPost = async (req, res, next) => {
    const baseQuery = 
        `BEGIN MY_PKG.create_requests(:req_id,
                                    :req_priority,
                                    :rep_id,
                                    :date_required,
                                    :req_notes,
                                    :rep_person_id,
                                    :created_by,
                                    :approved_by,
                                    :status,
                                    :inbv,
                                    :attachment_files,
                                    :success); END;`;
    
    // console.log(baseQuery)
    let files = []
    try {
       files =  moveUploadedFiles(req.files.reqAttachment);
    } catch (error) {
        console.log('\x1b[31m', 'ERROR: CAN NOT UPLOAD FILES', '\x1b[0m');
    }
    let connect;
    connect = await oracledb.getConnection();
    const RecTypeClass = await connect.getDbObjectClass(process.env.SCHEMA + '.t_rectype');
    const attachmentCollection = await connect.getDbObjectClass(process.env.SCHEMA + '.ATTACHMENT_COLLECTION');
    const attachment_files = new attachmentCollection(files);
    // const RecTypeClass = await connect.getDbObjectClass("t_rectype");


    const reqDtlIDs  = [];
    const reqTypeIDs = [];
    const reqRemarks = [];
    const reqRows = [];
    if(req.body.reqDetails) {
        if(Array.isArray(req.body.reqDetails)){
            req.body.reqDetails.forEach(element => {
                // reqDtlIDs.push(parseInt(element.dtl_id))
                // reqTypeIDs.push(parseInt(element.request));
                // reqRemarks.push(element.remarks);
                let obj = JSON.parse(element);
                const json = {REQ_DTL_ID: parseInt(obj.dtl_id),
                            REQ_REMARKS: obj.remarks,
                            SR_TYPE_ID: parseInt(obj.request)};
        
                reqRows.push(json);
                
        
            });
        } else {
            let obj = JSON.parse(req.body.reqDetails);
            const json = {REQ_DTL_ID: parseInt(obj.dtl_id),
                        REQ_REMARKS: obj.remarks,
                        SR_TYPE_ID: parseInt(obj.request)};
    
            reqRows.push(json);
        }
    }
    const binds = {
        req_id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(req.query.request_id)
        },
        req_priority: {
            type: oracledb.VARCHAR,
            dir: oracledb.BIND_IN,
            val: req.body.reqPriority
        },
        rep_id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(req.body.reqRepresentative)
        },
        date_required: {
            type: oracledb.VARCHAR,
            dir: oracledb.BIND_IN,
            val: req.body.reqDateRequired
        },
        req_notes: {
            type: oracledb.VARCHAR,
            dir: oracledb.BIND_IN,
            val: req.body.reqNotes
        },
        rep_person_id: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(req.body.reqRepPersonID)
        },
        created_by: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(req.body.createdBy)
        },
        approved_by: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(req.body.reqRecipient) || parseInt(req.body.createdBy)
        },
        status: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_IN,
            val: parseInt(req.body.status)
        },
        inbv: { 
            type: RecTypeClass, 
            dir: oracledb.BIND_IN,
            val: reqRows
        },
        attachment_files,
        success: {
            dir: oracledb.BIND_OUT,
            type: oracledb.VARCHAR
        }
    }

    console.log('\x1b[32m', binds, '\x1b[0m');

    try {
        await database.simpleExecute(baseQuery, binds)
            .then(response => {
                const mailer = new nodemailer();
                mailer.sendMail('job_request_created', {
                    receiver: 'renz',
                    sender: 'diether',
                    receiverEmail: 'renz.martin_cerico@tailinsubic.net',
                    objID: 192
                });
                res.status(201).json(response.outBinds);
            })
            .catch(err => {
                next(err);
            })
            .finally(() => {
                connect.close();
            });
        // res.status(201).json(result.outBinds);
        
    } catch (err) {
        next(err);
    }
};

module.exports.request = requestPost;

const getAllRequest = async (req, res, next) => {
    const result = await request.all();
    res.status(200).json(result);
};

module.exports.getAllRequest = getAllRequest;

const getAllRequestById = async (req, res, next) => {
    const result = await request.allById(req);
    res.status(200).json(result);
};

module.exports.getAllRequestById = getAllRequestById;

const getRequestById = async (req, res, next) => {
    try {
        id = req.params.id;
        const json = {
            id
        };
    
        const resultRequest = await request.getRequestById(json);
        const resultDetails = await request.getRequestDetailsById(json);
        const resultAttachments = await request.getRequestAttachmentsById(id);

        const result = {
            request: resultRequest,
            details: resultDetails,
            attachments: resultAttachments
        };

        res.status(200).json(result);
    } catch(err) {
        next(err);
    }
};

module.exports.getRequestById = getRequestById;

const updateRequest = async (req, res, next) => {
    try {
        const result = await request.updateStatus(req);
    
        res.status(200).json(result.outBinds);
    } catch (err) {
        next(err);
    }
};

module.exports.updateRequest = updateRequest;

const updateRequestDetails = async (req, res, next) => {
    try {
        const result = await request.updateRequestDetails(req);
        
        res.status(200).json(result.outBinds);
    } catch (err) {
        next(err);
    }
};

module.exports.updateRequestDetails = updateRequestDetails;

const transfer = async (req, res, next) => {
    try {
        const result = await request.transfer(req);

        res.status(200).json(result.outBinds);
    } catch (err) {
        next(err);
    }
};

module.exports.transfer = transfer;

const moveUploadedFiles = (files) => {
    const path = 'uploads/appui/';
    let fullpath = '';
    let accesspath = '';
    let arr = [];
    if(files) {
        console.log(files);
        if(Array.isArray(files)) {
            files.forEach((el, i) => {
                const tmp_name = Date.now() + '_' + el.name;
                fullpath = path + tmp_name;
                el.mv(fullpath, (err) => {
                    if(err) {
                        console.log('\x1b[31m', err, '\x1b[0m');
                    }
                });
                arr.push({
                    ID: null,
                    REQ_ID: null,
                    IMG: tmp_name,
                    DATE_CREATED: null
                });
            });
        } else {
            const tmp_name = Date.now() + '_' + files.name;
            fullpath = path + tmp_name;
            files.mv(fullpath, (err) => {
            if(err) {
                console.log('\x1b[31m', err, '\x1b[0m');
            }
            });
            arr.push({
                ID: null,
                REQ_ID: null,
                IMG: tmp_name,
                DATE_CREATED: null
            });
        }
    }
    return arr;
}

const getImage = async (req, res, next) => {
    fs.readFile('uploads/appui/' + req.params.img, (err, file) => {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");    
        } else {
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(file);
        }
    });
}

module.exports.getImage = getImage;

const deleteRequest = async (req, res, next) => {
    try {
        const id = req.body.id;

        const rows = await request.deleteRequest(id);

        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
};

module.exports.deleteRequest = deleteRequest;