var express           = require("express"),
    app               = express(),
    mongoose          = require("mongoose"),
    bodyParser        = require("body-parser"),
    passport          = require("passport"),
    LocalStrategy     = require("passport-local"),
    flash             = require("connect-flash"),
    methodOverride    = require("method-override"),
    User              = require("./models/user"),
    Tournament        = require("./models/tournament"),
    Round             = require("./models/round"),
    Game              = require("./models/game"),
    Scheduler         = require("./tours/scheduler.js"),
    middleware        = require("./middleware"),
    routers           = require("./routes");
Scheduler.seedDB();    
//"mongodb://localhost:27017/poolbar"
mongoose.connect(/*"mongodb://localhost:27017/poolbar"*/process.env.DATABASE,{useNewUrlParser: true});
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret:"moshe-chaim is awesome",
    resave:false,
    saveUninitialized:false
}));
app.use(methodOverride("_method"));
app.use(flash())

// PASSPORT CONFIGURETIOIN
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware for ejs objects
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.currentDir  = req.originalUrl;
    next();
});


//============
// ROUTES
//============
app.get("/",function(req,res){
    res.render("poolbar");
});
routers.forEach(function(obj){
    app.use(obj.url,obj.router);
});
// console.log("----------------------------------------------",process.env.PORT,process.env.IP);
app.listen(process.env.PORT,process.env.IP,function(){
    console.log('Server is Listening! PORT:',process.env.PORT);
});