var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Tournament  = require("../models/tournament"),
    Scheduler   = require("../tours/scheduler"),
    middleware  = require("../middleware");

// TOURNAMENTS
router.get("/",function(req,res){
   Tournament.find({}).populate({//find tournament and populate players of games of rounds
        path:"rounds",
        populate: { path: 'games',
                    populate:[{path:'player1'},{path:'player2'}]}
    }).exec(function(err,foundTournaments){
        if(err) { 
            console.log(err);
            res.redirect("back");
        }
        res.render("tournaments/index",{tournaments:foundTournaments}); 
    });
});
router.post("/",middleware.checkAdmin,function(req,res){
    var tournament =req.body.tournament;
    tournament.date = new Date(tournament.date);
    var newTournament = new Tournament(tournament);
    // console.log(tournament);
    Tournament.create(newTournament,function(err,foundTournament){
        if(err) return handleError(err);
        res.redirect("/tournaments");
    })
});
router.delete("/:id",middleware.checkAdmin,function(req,res){
    Tournament.findByIdAndRemove(req.params.id,function(err){
        if(err)return handleError(err);
        res.redirect("/tournaments");
    });
});
router.get("/new",middleware.checkAdmin,function(req, res) {
    res.render("tournaments/new");
});
router.get("/:id", function(req, res) {
    Tournament.findById(req.params.id).populate({//find tournament and populate players of games of rounds
        path:"rounds",
        populate: { path: 'games',
                    populate:[{path:'player1'},{path:'player2'}]}
    }).exec(function(err,foundTournament){
        if(err) { 
            console.log(err);
            res.redirect("back");
        }
        res.render('tournaments/show',{tournament:foundTournament,winner:Scheduler.winner});
    });
});
function handleError(err) {
    console.log(err);
    
}

module.exports = router;