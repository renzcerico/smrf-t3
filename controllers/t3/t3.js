const t3 = require('../../db_apis/t3/t3.js');
const t3Batch = require('../../db_apis/t3/t3Batch_info.js');
const storeAll = async (req = {}, res, next = null) => {
    const data = {
        header_obj          : req.body.header_obj,
        activity_collection : req.body.activity_collection,
        manpower_collection : req.body.manpower_collection,
        material_collection : req.body.material_collection,
        user_id             : req.body.user_id
    };
    const request = await t3.storeAll(data)
    .catch(error => { console.log('caught', error.message); });
    res.status(201).json(request);
}

module.exports.storeAll = storeAll;

const getAllByBarcode = async (req = {}, res, next = null) => {
    try {
        const request = await t3.getAllByBarcode(req.params.barcode)
        .catch(error => { console.log('caught', error.message); });
        if (Object.entries(request).length > 0) {
            request.isExisting = true;
            res.status(201).json(request);
        } else {
            const response = {
                isExisting: false
            };
            res.status(201).json(response);
        }
      } catch (err) {
        next(err);
      }
}

module.exports.getAllByBarcode = getAllByBarcode;

const getDowntimeTypes = async (req = {}, res, next = null) => {
    try {
        const request = await t3.getDowntimeTypes()
        .catch(error => { console.log('caught', error.message); });
        res.status(201).json(request);
    } catch (err) {
        next(err);
    }
}

module.exports.getDowntimeTypes = getDowntimeTypes;

const getHeaderCountPerStatus = async (req = {}, res, next = null) => {
    try {
        const user = req.session.t3_user;
        let user_id;
        (user ? user_id = user.ID : user_id = 0);   
        // console.log('USER_ID: ', user_id);
        const request = await t3.getHeaderCountPerStatus(user_id)
        .catch(error => { console.log('caught', error.message); });
        res.status(201).json(request);
    } catch (err) {
        next(err);
    }
}

module.exports.getHeaderCountPerStatus = getHeaderCountPerStatus;

const getHeaderByStatus = async (req = {}, res, next = null) => {
    try {
        const user = req.session.t3_user;
        (user ? req.body.user_id = user.ID : req.body.user_id = 0);
        const request = await t3.getHeaderByStatus(req.body)
        .catch(error => { console.log('caught', error.message); });
        if (Object.entries(request).length > 0) {
            request.isExisting = true;
            res.status(201).json(request);
        } else {
            const response = {
                isExisting: false
            };
            res.status(201).json(response);
        }
      } catch (err) {
        next(err);
      }
}

module.exports.getHeaderByStatus = getHeaderByStatus;

const getServerTime = async (req = {}, res, next = null) => {
    try {
        const request = await t3.getServerTime()
        .catch(error => { console.log('caught', error.message); });
        res.status(201).json(request);
      } catch (err) {
        next(err);
      }
}

module.exports.getServerTime = getServerTime;

const getAllPositions = async (req = {}, res, next = null) => {
    try {
        const request = await t3.getAllPositions()
        .catch(error => { console.log('caught', error.message); });
        res.status(201).json(request);
      } catch (err) {
        next(err);
      }
}

module.exports.getAllPositions = getAllPositions;


const get = async (req, res, next) => {
    try {
        
        const barcode = req.params.barcode.split('-');
        const context = {};
        context.header_id   = barcode[1];
        context.line_id     = barcode[2];
        context.batch_no    = barcode[3];

        console.log(context)

        const rows = await t3Batch.getBatchinfo(context);
        // rows = JSON.parse(rows);
        if (rows) {
            if (rows.batch_collection) {
                rows.header_obj = rows.batch_collection[0];
                rows.isExisting = true;
                delete rows.batch_collection;
                console.log(rows);
                res.status(200).json(rows);
            } else {
                res.status(200).json({isExisting: false});
            }
        } else {
            res.status(200).json({isExisting: false});
        }
    } catch (err) {
        next(err);
        console.log(err);
    }
};

module.exports.get = get;

const changePassword = async (req = {}, res, next = null) => {
    try {
        let data = req.body;
        delete data.confirm_password;
        console.log('\x1b[32m','SESSION: ', req.session, '\x1b[0m');
        data.user_id = req.session.t3_user.ID;
        const request = await t3.changePassword(data)
        .catch(error => { console.log('caught', error.message); });
        res.status(201).json(request);
      } catch (err) {
        next(err);
      }
}

module.exports.changePassword = changePassword;

const createDowntimeTypes = async (req = {}, res, next = null) => {
    console.log('\x1b[32m', 'dt: ', req.body, '\x1b[0m');
    try {
        let downtimeTypes = req.body.downtime_types
        const request = await t3.createDowntimeTypes(downtimeTypes)
        .catch(error => { console.log('caught', error.message); });
        res.status(201).json(request);
      } catch (err) {
        next(err);
      }
}

module.exports.createDowntimeTypes = createDowntimeTypes;