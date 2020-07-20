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