
// Define it
module.exports = function isLoggedIn(req, res, next) {
    // console.log("CHECKING RESTRICTED ROUTE!!", req.session);
    // console.log('is authenticated?: ' + JSON.stringify(req.session));
    try{
        if (!req.session.passport) {
            res.status(401);
            res.json({"msg":"You are not authorized!", status: 401});
            return res;
        }
        return next();
    }catch(e){
        return next(e);
    }

}
