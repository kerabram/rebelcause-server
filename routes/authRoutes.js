const express = require("express");
//NEW: Define Passport
const passport = require("passport");

const router = express.Router();

const { register, login, logout, localLogin } = require("../controllers/authController");

//All routes in this file start with "/auth"
router.get("/", (request, response, next) => {
    return response.json("auth routing initialized")
}) //http://localhost:3000/auth

//FUNDAMENTAL ROUTES - NO TOUCHY FROM NOW ON - FAILSAFE
router.post("/register", register); //http://localhost:3000/auth/register

router.get("/login", login);

router.get("/login/error", (request, response, next) => {
    return response.json("Login error");
});

router.get("/login/local", localLogin);

router.get("/logout", logout);

//STAGE GOOGLE AUTH - PER 3
router.get("/login/google", //http://localhost:3000/auth/login/google
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", //Remove "/auth" (formerly "/auth/google/callback")
    passport.authenticate("google", {
        failureRedirect: "/login",
        successRedirect: "/dashboard",
    })
);

//STAGE GITHUB AUTH - OPTIONAL


//ADVANCED ROUTES - PER 2

const checkAuthentication = (request, response, next) => {
    //NEW: REFACTOR THIS IF-ELSE STATEMENT
    if (!response.result) { //UPGRADE: Instead of assessing if the response is NOT ok, let's see if we don't get a result from the response
        return next();
    } else if (response.ok && !request.isAuthenticated()) { //UPGRADE: change to else if, we will see if the response is OK AND the request is NOT authenticates, to catch attempted overrides - if (response.ok && !request.isAuthenticated())
        response.json("Warning: user is not authenticated").redirect(403, "/unauthenticated");
    }
}; //Theoretically, the "else" part of the statement runs after this ends, hence when it's called in a route, for example...

//Then, stage a get route of /admin where there is a callback function that has the checkAuth handler with the below routes inside of it.
router.get("/admin", checkAuthentication, (request, response, next) => {
    console.log("Passed admin route. Assessing authentication of user...")

    try {
        //Nested routes: start with "/auth/admin/..." //NEW: api --> auth
        if (localLogin.call(response.result)) { //the result is called above
            function auth() {
                console.log("Auth successful within admin console.")
                //Kit: better routing path re: naming convention
                console.log("Redirecting to webmaster route - http://localhost:3000/auth/admin/auth-console")

                //NEW: return this line of code and append .redirect("/auth-console") to the end of the json message
                response.json("Authenticated via route").redirect("/auth-console");

                //Kit: this is OK, but not clear - failsafe code
                //response.json("Redirecting to webmaster route - http://localhost:3000/api/admin/auth")
                // router.get("/admin/auth", checkAuthentication,(request, response, next) => {
                //     response.json("Authenticated via route");
                // });
            }
            auth()
        }
        
    } catch (error) {
        response.redirect("/unauthenticated") //shorten to "/unauthenticated"
    }
    }
    
);

//NEW: - PER 2
// "auth/admin/auth-console" --> should trigger success if we are in nested routes
router.get("/admin/auth-console", (request, response, next) => {
    response.json("The user is authenticated within the auth console.");
});


// “/api/unauthenticated” --> formerly
//NEW CHANGE: - PER 2
// “/auth/admin/unauthenticated”
router.get("/admin/unauthenticated", (request, response, next) => {
    console.log("Returning to the homepage...")
    response.redirect("/");
});

module.exports = router;