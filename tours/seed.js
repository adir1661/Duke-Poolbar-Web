var util = require('util'),
    Tournament = require("../models/tournament"),
    Round = require("../models/round"),
    Game = require("../models/game"),
    User = require("../models/user");
var players = ['yarin', 'adir', 'itamar', 'david', 'michael', 'jambiko', 'moshiko', 'moti', 'asaf', 'ori', 'tomer', 'aba', 'vivi', 'roi', 'sagi levi', 'moshe-chaim'];// renderPlayers(num)
var playersTmp = [];
players.forEach(function (player) {
    playersTmp.push(player.charAt(0).toUpperCase() + player.slice(1));
});
players = playersTmp;

function seedDB(cb) {
    resetTournament1(function () {
        createTournament1(function (tournament) {
            removeUsers(tournament, function () {
                addNewUsersToTournament(tournament, function (foundTournament) {
                    console.log(">>>>>>>>>>>>>.seccessful seeding!.<<<<<<<<<<<<<");
                    return cb(foundTournament._id);
                });
            });
        });
    });
}

function resetTournament1(cb) {
    Tournament.remove({}, function (err) {
        if (err) return handleError(err);
        else {
            console.log("tournament removed");
            return cb();//create Tournament
        }
    });
}

function createTournament1(cb) {
    var tournament1 = {
        name: "Poolbar Tours 0000",
        numberOfPlayers: 16,
        date: new Date(),
        state: "waiting"
    };

    Tournament.create(tournament1, function (err, tour) {
        if (err) return handleError(err);
        else {
            console.log("tournament created!", tour);
            Tournament.find({},function (err,tournaments) {
                if (err) return handleError(err);
                else{
                    console.log("----------------------tournaments that found:",tournaments);
                }
            });
            return cb(tour);//cb = remove users
        }
    });
}

function removeUsers(tournament, cb) {
    User.remove({}, function (err) {
        if (err) return handleError(err);
        else {
            var newUser = new User({
                username: "admin",
                name: "admin",
                role: process.env.ADMIN
            });

            User.register(newUser, "lubilubi321", function (err, user) {
                if (err) return handleError(err);
                console.log("admin created", user);
                return cb();//add new users to tournament
            });
        }
    })
}

function addNewUsersToTournament(tournament, cb) {
    function registerRecursively(index,names){
        console.log("recursive call ", names[index]);
        var newUser = new User({
            username: names[index] + "1551@gmail.com",
            name: names[index],
            role: process.env.USER
        });
        User.register(newUser, "1234", function (err, user) {
            if (err) {
                console.log("ERROR + "+user);
                console.log(err);
            } else {// add all users
                console.log("index =" + index);
                var playerAdded = tournament.addPlayer(user);
                if (!playerAdded) console.log("player not added to  tour, check Tournament.addplayer");
                if (tournament.isFull()){
                    delete tournament.__v;
                    tournament.save(function (err) {
                        if (err) return handleError(err);
                        console.log("tournament saved with full of players~!");
                        return cb(tournament);
                    });
                }else if (index < names.length) {
                    registerRecursively(index+1,names);
                }
            }
        });
    }
    registerRecursively(0,players);
}

function addUserToTournament(user, tournament,cb) {
    var playerAdded = tournament.addPlayer(user);
    if (playerAdded) {
        // log(tournament);
        tournament.save(function (err) {
            if (err) return handleError(err);
            if (tournament.players.length === players.length) {
                return cb(tournament);
            }
        });
    }
}

function changeLog() {
    var log =console.log;
    console.log =function() {
        log.apply(console, arguments);
        // Print the stack trace
        console.trace();
    };
}


function dateToString(dateTime) {
    var today = dateTime;
    var dd = today.getDate();
    var mm = (today.getMonth() + 1); //January is 0!
    var yyyy = today.getFullYear();
    mm++;
    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    var todayStr = dd + '/' + (mm) + '/' + yyyy;
    return todayStr;

}

function log(myObject) {
    console.log(util.inspect(myObject, {showHidden: false, depth: null}))
}

function handleError(err) {
    console.log(err);
    return err;
}

module.exports = seedDB;