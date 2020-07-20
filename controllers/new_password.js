const new_pass = require('../db_apis/new_password.js');
 
function getLoginFromRec(req) {
    const login = {
      user: req.body.user,
      pass: req.body.pass};

      return login;
}

async function post(req, res, next) {
  try {
    console.log(req)
    let login = getLoginFromRec(req);
  console.log(login)
    login = await new_pass.setPassword(login);
  
    res.status(201).json(login);

  } catch (err) {
    next(err);
  }
}
  
module.exports.post = post;