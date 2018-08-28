var util        = require('util'),
    Tournament  = require("../models/tournament"),
    Round       = require("../models/round"),
    Game        = require("../models/game"),
    User        = require("../models/user");
    

var players = ['yarin','adir','itamar','david','michael','jambiko','moshiko','moti','asaf','ori','tomer','aba','vivi','roi','sagi levi','moshe-chaim'];// renderPlayers(num) 
var playersTmp =[];
    players.forEach(function(player) {
        playersTmp.push(player.charAt(0).toUpperCase() + player.slice(1));
    });
    players=playersTmp;

function seedDB(cb){
    resetTournament1(function(){
        createTournament1(function(tournament){
            removeUsers(tournament,function(){
                addNewUsersToTournament(tournament,function(foundTournament){
                    console.log(">>>>>>>>>>>>>.seccessful seeding!.<<<<<<<<<<<<<");
                    return cb(foundTournament._id);
                });
            });
        });
    });
}

function removeUsers(tournament,cb){
    User.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            return cb()
        }
    })
}
function addNewUsersToTournament(tournament,cb){
    var i =0;
    players.forEach(function(playerName) {
        var j = i++;
        var newUser = new User({
            username: playerName+"1551@gmail.com",
            name:playerName
        });
        User.register(newUser,"1234",function(err,user){
            if (err){
                console.log(err);
            }else{// add all users
                addUserToTournament(user,function(foundTournament){
                    if(foundTournament.isFull())
                        return cb(foundTournament);
                });
            }
        });
    });
}
function resetTournament1(cb){
    Tournament.remove({},function(err){
        if(err){
            log(err);
        }else{
            return cb();
        }
    });
}
function createTournament1(cb){
    var tournament1 = {
            name: "Poolbar Tours 0000",
            numberOfPlayers:16,
            date: new Date(),
            state: "waiting"
        }
    Tournament.create(tournament1,function(err,tour){
        if(err){
            log(err);
        }else{
            return cb(tour);
        }
    });
}
function addUserToTournament(user,cb){
    Tournament.find({},function(err,foundTournament){
        if(err) return handleError(err)
        var playerAdded = foundTournament[0].addPlayer(user);
        if(playerAdded){
            // log(tournament);
            foundTournament[0].save(function(err){
                if (err) return handleError(err);
                if(foundTournament[0].players.length===players.length){
                return cb(foundTournament[0]);
                }    
            });
        }
    });
}
function dateToString(dateTime){
    var today = dateTime;
    var dd = today.getDate();
    var mm = (today.getMonth()+1); //January is 0!
    var yyyy = today.getFullYear();
    mm++;
    if(dd<10) {
        dd = '0'+dd
    } 
    
    if(mm<10) {
        mm = '0'+mm
    } 
    
    var todayStr = dd + '/' +(mm)  + '/' + yyyy;
    return todayStr;
    
}
function log(myObject){
    console.log(util.inspect(myObject, {showHidden: false, depth: null}))
}
function handleError(err) {
    console.log(err);
    return err;
}
module.exports = seedDB;