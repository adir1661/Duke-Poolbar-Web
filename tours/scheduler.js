var util        = require('util'),
    faker       = require("faker"),
    Tournament  = require("../models/tournament"),
    Round       = require("../models/round"),
    Game        = require("../models/game"),
    User        = require("../models/user"),
    seedDB      = require("./seed");    
function runTour(){
    seedDB(renderTour);
}
function log(myObject){
    console.log(util.inspect(myObject, {showHidden: false, depth: null}))
}
function renderFakePlayers(num){
    var check =Math.log(num)/Math.log(2)
    if( check !== Math.floor(check)){
        return -1;
    }else{
        var players = []
        for (var i = 0 ; i < num; i ++){
            players.push(faker.name.firstName());
        }
    }
    return players;
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------
function renderTour(id){
    console.log('render tour running...',id)
    findTournament({_id:id},function(foundTournament){
        createGamesOfFirstRound(foundTournament,function(games){// WARNING ,also deletes all games from database!!
            removeRounds(function(){
                function recursiveCallForAddingRound(tmpTournament,tmpGames,level) {
                    createAndAddRound(tmpTournament,tmpGames,function(updatedTournament){
                        var tmpTournament2 = updatedTournament;
                        setWinners(updatedTournament,level,function(winners){//place to collect results of games and update all games, once games finish create another round
                            if(winners.length>1){
                                console.log("setWinners callback");
                                createGamesForPlayers(winners,function(newGames){
                                    var tmpGames2 = newGames;
                                    recursiveCallForAddingRound(tmpTournament2,tmpGames2,level+1);
                                });//createGamesForPlayers
                            }else{
                                console.log("the winner is: ",winners[0].name);
                                exports.winner = winners[0].name;
                            }
                        });//setWinners
                    });//createAndAddRound
                }//recursive call
                recursiveCallForAddingRound(foundTournament,games,1);
            });//removeRounds
        });//creategamesoffirstround
    });//findTournament
}
//---------------------------------------- renderTour sub-functions: -----------------------------------------------

function findTournament(obj,cb) {
    Tournament.findOne(obj).populate("players").exec(function(err,foundTournament){
        if(err) return handleError(err);
        return cb(foundTournament)
    });
}
//----------------------------------------findTournament ends-----------------------------------------------

function createGamesOfFirstRound(tournament,cb){
    var playersrandomized = orderPlayers(tournament);
    Game.remove({},function(err){
        if(err) return handleError(err);
        createGamesForPlayers(playersrandomized,cb);
    });
}
function createGamesForPlayers(players,cb){//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<------createGamesForPlayers
    var newGames = [];
    for(var i=0 ;i<players.length;i+=2){
        var j = i;
        var newGame = new Game({
            player1:players[i],
            player2:players[i+1],
            date: null,
            state: "waiting"
        });
        newGames.push(newGame);
    }
    // create a list of games (newGames) to the database
    Game.create(newGames,function(err,games){
        if(err) return handleError(err);
        console.log("created "+games.length+" games for "+players.length +" players ")
        return cb(games);
    });
}
function orderPlayers(tournament){
    log(tournament.players.length+" is the number of players on list...");
    var players = tournament.players;
    return orginizeFirstRound(players);
}
function orginizeFirstRound(players){
    //TODO: here we should insert algorithm to orginize the first round of the tournament!
    var playersrandomized =[];
    for (var i = 0 ; i < players.length ; i ++){
        while(playersrandomized.length < i+1){
            var j =Math.floor(Math.random()*players.length);
            if(!(playersrandomized.indexOf(players[j])>=0)){
                playersrandomized.push(players[j]);
            }
        }
    }
    return playersrandomized;
}

//----------------------------------------createGamesOfFirstRound ends-----------------------------------------------

function removeRounds(cb){
    Round.remove({},function(err) {
        if(err) return handleError(err);
        return cb();
    });
}
//----------------------------------------removeRounds ends-----------------------------------------------
function createAndAddRound(tournament,games,cb){
    console.log("create and add round's tournament:");
    var roundLevel= tournament.findLevel() - Math.log(games.length)/Math.log(2);
    console.log(tournament.name ,", num of games: ", games.length,", round level: ", roundLevel);
    var newRound = new Round({
        numOfGames:games.length,
        level: roundLevel,
        games:games
    })
    console.log("create and add round")
    Round.create(newRound,function(err,round){
        if(err) return handleError(err);
        tournament.rounds.push(round);
        tournament.save(function(err,tournamt){
            if(err){
                console.log(err);
                return err;
            }
            // console.log(tournament.rounds);
            Tournament.findOne({}).populate("rounds").exec(function(err,foundTournament){
                if(err) return handleError(err);
                console.log('returning:',foundTournament.name);
                return cb(foundTournament);
            });
        });
    });
}
//----------------------------------------createAndAddRound ends-----------------------------------------------

function setWinners(tournament,level,cb){
    console.log("setWinners()");
    Tournament.findOne({_id: tournament._id}).populate({//find tournament and populate players of games of rounds
        path:"rounds",
        populate: { path: 'games',
                    populate:[{path:'player1'},{path:'player2'}]}
    }).exec(function(err,foundTournament){
        if(err)return handleError(err);
        var roundNumber = level-1;
        console.log('games were seeded correctly on round level '+ level+' ',foundTournament.rounds[roundNumber].level);
        var games = foundTournament.rounds[roundNumber].games;
        var winners = [];
        //TODO: right now we are setting the winners on the games randomly ... should be executed by event!
        games.forEach(function(game){
            var j =Math.floor(Math.random()*2);
            switch(j){
                case 0:
                    // console.log(game.player1);
                    winners.push(game.player1);
                    game.winner = 0;
                    break;
                case 1:
                    winners.push(game.player2);
                    game.winner = 1
                    break;
            }
            console.log("winner :",j);
        });//foreach
        var i=0;
        games.forEach(function(game){
            // console.log("game's winner:",game);
            game.save(function(err) {
                i++;
                if (err) return handleError(err);
                console.log('game saved',games.length);
                if (i===games.length){
                    return cb(winners);
                }
            });
        });
    });//exec
}
//----------------------------------------setWinners ends-----------------------------------------------

function handleError(err){
    console.log(err);
    return err;
}
// console.log(' lets start: ');
// renderTour(16);
// exports.render =renderTour;
exports.seedDB = runTour;

// console.log(competition);
// console.log(tournament);
// log(competition.rounds[0]);
// console.log(competition.rounds[0].game[1]);
