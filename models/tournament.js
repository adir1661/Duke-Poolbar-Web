var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/poolbar");

var tournamentSchema = new mongoose.Schema({
   name: String,
   numberOfPlayers:String,
   date: {
       type: Date,
       default: Date.now()
   },
   state: String,
   players: [{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"
   }],
   rounds: [{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Round"
   }]
});
tournamentSchema.methods.findLevel = function(){
    return Math.log(this.numberOfPlayers)/Math.log(2);
}
tournamentSchema.methods.isFull = function(){
    return this.numberOfPlayers<=this.players.length;
}
tournamentSchema.methods.addPlayer = function(id){
    if(this.players.length<this.numberOfPlayers){
        this.players.push(id);
        return true;
    }else{
        return false;
    }
};
var Tournament =mongoose.model("Tournament",tournamentSchema);
module.exports =  Tournament;
 