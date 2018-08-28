var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/poolbar");

var roundSchema = new mongoose.Schema({
    games: [{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Game"
   }],
   numOfGames: Number,
   level: Number
});
var Round =mongoose.model("Round",roundSchema);
module.exports =  Round;