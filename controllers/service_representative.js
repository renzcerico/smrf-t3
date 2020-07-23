const serviceRepresentative = require('../db_apis/service_representative.js');
const database = require('../config/database.js');

const get = async (req, res, next) => {
    try {
        const rows = await serviceRepresentative.representative();
        
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(204).end();
        }
    } catch (err) {
        next(err);
        console.log(err);
    }
};

module.exports.get = get;

const insert = async (req, res, next) => {
    try {
        const department = req.body.department;
        const departmentCode = department.replace(' ', '');
        const representativeID = req.body.representativeID;
        const departmentID = req.body.departmentID;
        
        const data = {
            department,
            departmentCode,
            representativeID,
            departmentID
        };

        const rows = await serviceRepresentative.insert(data);

        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
};

module.exports.insert = insert;

const update = async (req, res, next) => {
    try {
        const department = req.body.department;
        const departmentCode = department.replace(' ', '');
        const representativeID = req.body.representativeID;
        const id = req.params.id;
        
        const data = {
            department,
            departmentCode,
            representativeID,
            id
        };

        const rows = await serviceRepresentative.update(data);

        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
};

module.exports.update = update;