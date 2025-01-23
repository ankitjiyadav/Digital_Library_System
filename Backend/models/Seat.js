const mongoose = require("mongoose");
const seatSchema =new mongoose.Schema({
  seatNumber:{type: String,required:true,unique:true},
  isAvailable:{type:Boolean,default:true},
});
module.exports=mongoose.model("Seat",seatSchema);