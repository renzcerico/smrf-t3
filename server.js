const morgan = require('morgan');
const webServer = require('./services/web-server.js');
const database = require('./services/database.js');
const dbConfig = require('./config/database.js');
const defaultThreadPoolSize = 4;
 
// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;

async function startup() {
  console.log('Starting application');
  try {
    console.log('Initializing database module');
  
    await database.initialize(); 
  } catch (err) {
    console.error(err);
    process.exit(1); // Non-zero failure code
  }

  try {
    console.log('Initializing web server module');

    await webServer.initialize();
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }
}

startup();

async function shutdown(e) {
  let err = e;
    
  console.log('Shutting down');

  try {
    console.log('Closing web server module');

    await webServer.close();
  } catch (e) {
    console.log('Encountered error', e);

    err = err || e;
  }

  try {
    console.log('Closing database module');
 
    await database.close(); 
  } catch (err) {
    console.log('Encountered error', e);
 
    err = err || e;
  }

  console.log('Exiting process');

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');

  shutdown();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT');

  shutdown();
});

process.on('uncaughtException', err => {
  console.log('Uncaught exception');
  console.error(err);

  shutdown(err);
});

// const express = require('express');

// const app = express();

// app.use(express.static(process.cwd()+"/appui/"));

// const port = 3070;

// const settings = {
//     settings:"settings from server", 
//     title: "APP_UI", 
//     fullName: "Bhargav Bachina", 
//     pageWidth: "60%", 
//     text:"This settings coming from the server",
//     headerColor: "gray",
//     footerColor: "red"
// };

// app.get('/localapi/settings', (req,res) => {
//     console.log('--settings---');
//     res.json(settings)
// })

// app.get('/users', (req,res) => {
//   console.log('--users---');
//   res.json({users:[]})
// })

// app.get('/test', (req,res) => {
//   res.send("API works!!!");
// })

// app.get('/', (req, res) => {
//   res.sendFile(process.cwd()+"/appui/index.html")
// });


// httpServer = http.createServer(app);

// app.listen(port, (err) => {
//   if (err) {
//     logger.error('Error::', err);
//   }
//   console.log(`running server on from port:::::::${port}`);
// });