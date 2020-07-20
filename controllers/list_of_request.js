const list = require('../db_apis/list_of_request.js');

const post = async (req, res, next) => {
    try {
        const department = { department: req.body.department };
        const result = await list.requestList(department);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).end();
        }
    } catch (err) {
        next(err);
        console.log(err);
    }
};

module.exports.post = post;