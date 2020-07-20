const logins = require('../db_apis/logins.js');

function loginForm(req) {
    const login = {
      username: req.body.username,
      password: req.body.password
    };
    
    return login;
}

  async function post(req, res, next) {
    try {
      let login = loginForm(req);
      
      login = await logins.validLogin(login);

      if (login.length > 0) {
        req.session.username = login;
        res.status(200).json(login);
      } else {
        res.status(200).json(null);
      }
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;

  async function logout(req, res, next) {
    try {
      delete req.session.username;

      res.status(200).end();
    } catch (err) {
      next(err);
    }
  }

  module.exports.logout = logout;
