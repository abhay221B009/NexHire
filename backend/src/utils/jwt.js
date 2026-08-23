const jwt = require("jsonwebtoken");

const generateToken = (user)=>{
  const payload={
    userId:user._id.toString(),
    role:user.role,
  };


  //signing the payload using our secret key


  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn:process.env.JWT_EXPRESS_IN || "1d",
    }
  );
};

//verifying jwt


const verifyToken  = (token)=>{
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};

module.exports={
  generateToken,
  verifyToken,
};