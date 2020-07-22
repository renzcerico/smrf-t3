const user = require('../db_apis/user.js');
const database = require('../config/database.js');

const post = async (req, res, next) => {
    try {
        const data = {
            last_name: transform(req.body.last_name),
            first_name: transform(req.body.first_name),
            middle_name: transform(req.body.middle_name),
            username: req.body.username,
            user_level: req.body.user_level,
            department: req.body.department
        };

        let newUser = await user.insert(data);

        res.status(201).json(newUser);
    } catch(error) {
        next(error);
    }
};

module.exports.post = post;

const transform = (string) => {
    const arr = string.split('');
    arr[0] = arr[0].toUpperCase();
    return arr.join('');
}

const getAllUser = async (req, res, next) => {
    try {
        const users = await user.getAllUser();
        
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(200).send('No results found.');
        }

    } catch(err) {
        next(err);
    }
};

module.exports.getAllUser = getAllUser;

const deleteUser = async (req, res, next) => {
    try {  
        const id = req.params.id;

        let response = await user.deleteUser(id)

        res.status(200).send('Deleted');
    } catch(err) {
        next(err);
    }
}; 

module.exports.deleteUser = deleteUser;