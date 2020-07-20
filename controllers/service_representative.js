const serviceRepresentative = require('../db_apis/service_representative.js');

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