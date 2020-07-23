const department = require('../db_apis/department.js');

const get = async (req, res, next) => {
    try {
        const rows = await department.getDepartment();
    
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
        const departmentName = req.body.departmentName;

        const rows = await department.insert(departmentName);
        res.status(200).json(rows);

        // if (rows.length > 0) {
        //     res.status(200).json(rows);
        // } else {
        //     res.status(204).end();
        // }
    } catch (err) {
        next(err);
    }
};

module.exports.insert = insert;

const getByID = async (req, res, next) => {
    try {
        const departmentID = req.params.id;

        const rows = await department.getByID(departmentID);

        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
};

module.exports.getByID = getByID;

const update = async (req, res, next) => {
    try {
        const departmentName = req.body.departmentName;
        const id = req.params.id;

        const data = {
            id,
            department: departmentName.toUpperCase()
        };

        const rows = await department.update(data);

        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
};

module.exports.update = update;