const http = require('http');
// const cors = require('cors');
const express = require('express');
const webServerConfig = require('../config/web-server.js');
const router = require('./router.js');
const t3_router = require('./t3_router.js');
const database = require('./database.js');
const morgan = require('morgan');
var path = require("path");
var bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const io = require('socket.io');
const sharedsession = require('express-socket.io-session');
const fileUpload = require('express-fileupload');
require('dotenv').config();


let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();

    // Enabling CORS
    // app.use(cors());

    // app.use(function (req, res, next) {
    //   //Enabling CORS
    //   res.header('Access-Control-Allow-Origin', '*');
    //   res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret');
    //   // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
    //   next();
    // });

    app.use(function (req, res, next) {
      //Enabling CORS
      const allowed = [
        'http://localhost:4200',
        'http://localhost:4201',
        'http://localhost:4203',
        'http://localhost:3000',
        'http://t3apps.tailinsubic.com/',
        'http://service.tailinsubic.com/'
      ];
      const origin = req.headers.origin;
      if(allowed.indexOf(origin) > -1) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Credentials', true);
      // res.header('Access-Control-Allow-Origin', 'http://localhost:4201');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
      next();
    });


    httpServer = http.createServer(app);

    app.use(morgan('combined'));

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(cookieParser());
    const session = require('express-session')({
      genid: (req) => {
        return uuidv4();
      },
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      name: 't3_app'
    });

    //session setup
    app.use(session);

    
    // socket io setup
    const socketIO = io.listen(httpServer);
    
    socketIO.use(sharedsession(session));
    socketIO.on('connection', (socket) => {
      socket.on('headerStatusUpdate', (data) => {
        socketIO.emit('updateHeaderStatus', data);
      })
      socket.on('updatedHeader', (data) => {
        socketIO.emit('headerUpdated', data);
      });
    });

    // fileupload set up
    app.use(fileUpload({
      createParentPath: true
    }));

    app.use('/localapi', router);

    app.use('/t3api', t3_router);

    // app.get('/', (req, res) => {
    //   // res.redirect('production.html');
    // });

    // app.use(express.static('./www'));

    app.use(express.static(process.cwd()+"/appui/"));

    const settings = {
      settings:"settings from server", 
      title: "APP_UI", 
      fullName: "Bhargav Bachina", 
      pageWidth: "60%", 
      text:"This settings coming from the server",
      headerColor: "gray",
      footerColor: "red"
    };
  
    app.get('/localapi/settings', (req,res) => {
        console.log('--settings---');
        res.json(settings)
    })
    
    app.get('/users', (req,res) => {
      console.log('--users---');
      res.json({users:[]})
    })
    
    app.get('/test', (req,res) => {
      res.send("API works!!!");
    })
    
    app.get('/', (req, res) => {
      // res.sendFile(process.cwd()+"/appui/index.html")
    });
    app.use(express.static('./uploads'));
    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Web server listening on localhost:${webServerConfig.port}`);
        console.log('\x1b[31m', process.env.SCHEMA, '\x1b[0m');
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}

module.exports.initialize = initialize;

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }
 
      resolve();
    });
  });
}
 
module.exports.close = close;