const personnel = require('../db_apis/personnel.js')

async function get(req, res, next) {
  try {

    const context = {};
    context.search = req.params.search;

    const rows = await personnel.find(context);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).end();
    }
    
  } catch (err) {
    next(err);
  }
}
 
module.exports.get = get;

const getApprover = async (req, res, next) => {
    try {
      const department = req.params.id;
      
      const result = await personnel.getApprover(department);
  
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
};

module.exports.getApprover = getApprover;

const getAllUser = async (req, res, next) => {
    try {
      const dept = req.params.id;
      const result = await personnel.getAllUser(dept);

      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
};

module.exports.getAllUser = getAllUser;

const getChiefByDept = async (req, res, next) => {
  try {
    const dept = req.params.id;
    const result = await personnel.getChiefByDept(dept);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.getChiefByDept = getChiefByDept;
