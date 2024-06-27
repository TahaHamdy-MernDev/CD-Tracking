require("dotenv").config();
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message ,err.stack);
  process.exit(1);
});
const app = require("./config/app");
require("./config/database");
const PORT = process.env.PORT || 3000;


let server= app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION!  Shutting down...');
  console.log(err.name, err.message ,err.stack);
  server.close(() => {
      process.exit(1);
  }); 
});
   