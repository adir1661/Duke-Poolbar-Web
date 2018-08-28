var express     = require("express"),
    router      = express.Router(),
    middleware  = require("../middleware")

//GALLERY 
router.get("/",function(req,res){
    var urls = ["./images/20170710_212534.jpg",
    "./images/20170712_175028.jpg",
    "./images/20170710_213531.jpg",
    "./images/20170710_214301.jpg",
    "./images/20170928_010749.jpg"];
    res.render("gallery",{imageUrls:urls});
});
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render('newImg');
});
router.post("/",middleware.isLoggedIn,function(req,res){
    
});
module.exports = router;