var express             = require("express"),
    router              = express.Router(),
    User                = require("../models/user"),
    passport            = require("passport"),
    middleware          = require("../middleware"),
    TournamentsRouter   = require("./tournaments"),
    GalleryRouter       = require("./gallery")

//====================
//AUTH ROUTES
//====================
router.get("/register",function(req, res) {
    res.render('register');
});
router.post("/register",function(req,res){
    var newUser = new User({
        username: req.body.username,
        name:req.body.name
    });
    console.log("register")
    User.register(newUser,req.body.password,function(err,user){
        if (err){
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(err,user){//<= log user in (*with cookies)
            if(err){
                console.log(err);
            }else{
                res.redirect("/");
            }
        });
    })
})
router.get("/login",function(req, res) {
    res.render('login');
});
router.post("/login",
        passport.authenticate("local",{
            successRedirect:"/",
            failureRedirect:"login"
        }), function(req,res){
            console.log(req.body.username,"try login")
});
router.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/");
});






// collection of all routes 
var routers =[{
    router:router,
    url:"/"
},{
    router:TournamentsRouter,
    url:"/tournaments"
},{
    router:GalleryRouter,
    url:"/gallery"
}]
module.exports = routers;