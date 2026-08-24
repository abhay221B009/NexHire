const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    candidateId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
      index:true,
    },


    //job , the candidate applied for 

    jobId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Job",
      required:true,
      index:true,
    },


    //current stage of the application

    stage:{
      type:String,
      enum:[
        "Applied",
        "Screening",
        "Interview",
        "Offer",
        "Rejected",
        "Shortlisted",
        "Hired",
      ],
      default:"Applied",
      required:true,
      index:true,
    },

    //when the candidate submitted the application

    appliedAt:{
      type:Date,
      default:Date.now,
    },
  },

  {
    timestamps:true,
  }
);


//importtnt database constraint 
//a candidate can apply to a particular job only once using unique compound index at database level
//candidateId+jobId


applicationSchema.index(
{
  candidateId:1,
  jobId: 1,
},
{
  unique:true,
}
);

const application = mongoose.model(
  "Application",
  applicationSchema
);

module.exports = application;
