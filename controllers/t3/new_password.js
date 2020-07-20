const new_pass = require('../../db_apis/t3/new_password.js');
 
function getLoginFromRec(req) {
    const login = {
      user: req.body.user,
      pass: req.body.pass};

      return login;
}

async function post(req, res, next) {
  try {
    let login = getLoginFromRec(req);
    login = await new_pass.setPassword(login);
  
    res.status(201).json(login);

  } catch (err) {
    next(err);
  }
}
  
module.exports.post = post;