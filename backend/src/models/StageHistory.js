const mongoose = require("mongoose");

const stageHistorySchema = new mongoose.Schema(
  {
    //application whose stage is chanhed
    applicationId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Application",
      required:true,
      index:true,
    },


    //previous stage

    fromStage:{
      type:String,
      enum:[
        "Applied",
        "Screening",
        "Interview",
        "Offer",
        "Rejected",
      ],requied:true,
    },
  

  //new stage
  toStage:{
    type:String,
    enum:[
      "Applied",
        "Screening",
        "Interview",
        "Offer",
        "Rejected",
    ],
    required:true,
  },


  //recruiter who performed the change
  changedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    index:true,
  },
},

{
  timestamps:true,
}

);


const StageHistory  = mongoose.model(
  "StageHistory",
  stageHistorySchema
);

module.exports = StageHistory;