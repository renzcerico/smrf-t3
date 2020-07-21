const services = require('../db_apis/services.js');

const get = async (req, res, next) => {
    try {
        const rows = await services.get();

        res.status(200).json(rows);
    } catch(err) {
        next(err);
    }
};

module.exports.get = get;

const insert = async (req, res, next) => {
    try {
        const rows = await services.insert(req.body);
        
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
};

module.exports.insert = insert;

const getByID = async (req, res, next) => {
    try {
        const id = req.params.id;

        const rows = await services.getByID(id);

        res.status(200).json(rows);
    } catch(err) {
        next(err);
    }
};

module.exports.getByID = getByID;

const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const code = req.body.services_code;
        const name = req.body.services_name;
        const department = parseInt(req.body.services_deparment);

        const data = {
            id,
            code,
            name,
            department
        };

        const result = await services.update(data);

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports.update = update;