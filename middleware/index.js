var middlewareObj = {};

middlewareObj.isLoggedIn =  function(req,res,next){
    console.log("is logged in activated!");
    if(req.isAuthenticated()){
        return  next(); 
    }
    res.redirect("/login");
}
middlewareObj.checkAdmin = function(req,res,next){
    if(req.isAuthenticated()){
        return  next(); 
    }
    res.redirect("/login");
}

module.exports = middlewareObj;