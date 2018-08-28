var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/poolbar");

var gameSchema = new mongoose.Schema({
   player1:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"
   },
   player2:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"
   },
   date: Date,
   winner:Number,
   state: String
});
var Game =mongoose.model("Game",gameSchema);
 module.exports =  Game;