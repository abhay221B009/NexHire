const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema(
  {
    // Candidate who should receive the notification.
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    //application related to notification

    applicationId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Application",
      requied:true,
      index:true,
    },


    //message which is displayed to the candidate

    message:{
      type:String,
      required:true,
      trim:true,
      manlength:500,
    },

    //whether the candidate has read the notification

    isRead:{
      type:Boolean,
      default:false,
      index:true,
    },
  },
  {
    timestamps:true,
  }
);


  //usefull for fetching the latest unread notification

  notificationSchema.index({
    candidateId:1,
    isRead:1,
    createdAt:-1,
  });

  const Notification = mongoose.model(
    "Notification",
    notificationSchema
  );

  module.exports = Notification;


