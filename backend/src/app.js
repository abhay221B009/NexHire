const express  = require ("express");
const cors = require ("cors");
const helmet = require("helmet");
const cookieParser = require ("cookie-parser");
const rateLimit = require ("express-rate-limit");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:process.origin.CLIENT_URL,
    credentials:true,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15*60*1000,
  max:20,
  standardHeaders:true,
  legacyHeaders:false,
});

app.get("/api/health",(req,res)=>{
  res.status(200).json({
    success:true,
    message:"NexHire API is runnig",
  });
});

module.exports = {
  app,
  authLimiter,
};