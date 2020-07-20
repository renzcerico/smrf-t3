const jobs = require('../db_apis/job.js');

const create = async (req, res, next) => {
    try {
        const result = await jobs.create(req);

        res.status(200).json(result.outBinds);
    } catch (err) {
        next(err);
    }
};

module.exports.create = create;

const completed = async (req, res, next) => {
    try {
        const result = await jobs.completed(req);

        res.status(200).json(result.outBinds);
    } catch (err) {
        next(err);
    }
};

module.exports.completed = completed;

const getJob = async (req, res, next) => {
    try {
        const result = await jobs.getJob(req.params.id);
        
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports.getJob = getJob;

const getAllJobs = async (req, res, next) => {
    try {
        const result = await jobs.all();

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports.getAllJobs = getAllJobs;

const getAllJobsById = async (req, res, next) => {
    try {
        const result = await jobs.getAllJobsById(req.params.id);

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports.getAllJobsById = getAllJobsById;