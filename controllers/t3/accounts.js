const accounts = require('../../db_apis/t3/accounts');

const insert = async (req, res, next) => {
    try {
        const data = {
            ID: req.body.id || null,
            FIRST_NAME: req.body.firstName,
            MIDDLE_NAME: req.body.middleName,
            LAST_NAME: req.body.lastName,
            GENDER: req.body.gender,
            USER_LEVEL: req.body.userLevel,
            CREATED_AT: null,
            USERNAME: req.body.username,
            PASSWORD: null  
        };

        const result = await accounts.insert(data);
        const id = result.outBinds.id;

        if (id > 0) {
            res.status(200).json(result);
        } else {
            res.status(409).end();
        }
    } catch (err) {
        next(err);
    }
};

module.exports.insert = insert;

const all = async (req, res, next) => {
    try {
        const result = await accounts.all(req.body);

        res.status(200).json(result);
    } catch(err) {
        next(err);
    }
};

module.exports.all = all;

const getManpowerList = async (req, res, next) => {
    try {
        const result = await accounts.getManpowerList();

        res.status(200).json(result);
    } catch(err) {
        next(err);
    }
};

module.exports.getManpowerList = getManpowerList;

const getById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const result = await accounts.getById(id);
    
        res.status(200).json(result);
    } catch(err) {
        next(err);
    }
};

module.exports.getById = getById;

const resetPassword = async (req, res, next) => {
    try {
        const id = req.body.id || null;
        
        const result = await accounts.resetPassword(id);

        res.status(200).json(result.outBinds.output);
    } catch(err) {
        next(err);
    }
};

module.exports.resetPassword = resetPassword;