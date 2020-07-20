const logins = require('../../db_apis/t3/logins.js');
const database = require('../../config/database.js');

function getLoginFromRec(req) {
    const login = {
      user: req.body.username,
      pass: req.body.password
    };
    
    return login;
}

  async function post(req, res, next) {
    try {
      let login = getLoginFromRec(req);
      login = await logins.setlogin(login);
      const user = login[0];

      if (login.length > 0) {
        req.session.t3_user = user;
        req.session.save();
      }
      if (login.length > 0) {
        res.status(201).json(user);
      } else {
        res.status(401).end();
      }
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.post = post;

  const authenticate = async (req, res, next) => {
    try {
      const user = req.session.t3_user;
      res.status(200).json(user);

    } catch(err) {
      next(err);
    }
  };

  module.exports.authenticate = authenticate;

  const logout = async (req, res, next) => {
    try {
      delete req.session.t3_user;

      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  module.exports.logout = logout;

  const forwardList = async (req, res, next) => {
    try {
        if (!req.session.t3_user) {
          res.status(200).end();
        } else {
          const userLevel = req.session.t3_user.USER_LEVEL;
          result = await logins.forwardList(userLevel);
          res.status(200).json(result);
        }
    } catch (err) {
      next(err);
    }
  };

  module.exports.forwardList = forwardList;

  module.exports.logout = logout;

  const setUser = async (req, res, next) => {
    user = {
      name: 'diether llenares',
      username: 'diether',
      password: 'welcometailin',
      email: 'llenaresdiether@gmail.com'
    }
    req.session.t3_user = user;
    req.session.save();
    res.end();
  };

  module.exports.setUser = setUser;