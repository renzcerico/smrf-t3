const personnel = require('../../db_apis/t3/personnel.js')

async function get(req, res, next) {
  try {
    const rows = await personnel.find();

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
