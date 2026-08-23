const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      required:[true,"Name is required"],
      trim:true,
      minlength:[2,"Name must contain at least 2 characters"],
      maxlength:[50,"Name cannot exceed 50 characters"],
    },


    email:{
      type:String,
      required:[true,"Email is required"],
      unique:true,
      lowercase:true,
      trim:true,
      index:true,
    },

    passwordHash:{
      type:String,
      required:[true,"Password hash is required"],
    },

    role:{
      type:String,
      enum:["candidate","recruiter"],
      required:true,
    },
  },
  {
    timestamps:true,
  }
);

const User  =mongoose.model("User",userSchema);

module.exports = User;