var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/poolbar");

var playerSchema = new mongoose.Schema({
   name: String
});

var Player =mongoose.model("Player",playerSchema);

var david = new Player({
    name:'david'
});

Player.find(function(err,player){
    if (err){
        console.log("SOMETHING WENT WRONG!!");
    }else{
        console.log("we've found the player: " , player);
    }
})