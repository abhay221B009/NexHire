require("dotenv").config();
const dns = require("dns");

require("./config/dns");
require("./config/models");


const {app} = require("./app");

//importing our mongodb fucntion 
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 5000;


//starting server

const startServer = async()=>{
  try{
    await connectDatabase();


    app.listen(PORT,()=>{
      console.log(`NexHire API running on port ${PORT}`);
    });
  }catch(error){
    console.error("failed to start NexHire",error.message);

    process.exit(1);
  }
};

startServer();