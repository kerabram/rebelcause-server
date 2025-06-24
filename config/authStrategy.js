const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
//Define Google (MANDATORY) and GitHub (OPTIONAL) Strategies - PER 3
const GoogleStrategy = require("passport-google-oauth20").Strategy; //npm i passport-google-oauth20

//Summon the User Model
const User = require("../models/userModel");

//PER 2: We'll have Passport use the initialized new LocalStrategy from Passport.
passport.use(
    new LocalStrategy (async (username, password, done) => { //Three parameters: username, password and the done callback

    //Done Callback Skeleton
    /*
    function done(params) {
        message: ""
    }
    */
    
    //stage a try-catch statement
    try {

    //Define a single user by awaiting for the User model to use the findOne method to find their username.
      const user = await User.findOne({ username });

      //Error handling - if there is no user detected, return the done call-back
      if (!user) {
        //The username is null because it doesn't exist nor is there a password, hence false.
        return done(null, false, {
          message: "Incorrect username or password.", //send an appropriate message
        });
      }

      //Within the try block...
      //Store the result by awaiting for the bcrypt packages to compare the password the user has given versus the one stored in the database
      const result = await bcrypt.compare(password, user.password);

      //Error handling - if there is no result (password) detected, return the done call-back
      if (!result) {
        //The username is null because it doesn't exist nor is there a password, hence false.
        return done(null, false, {
            message: "Incorrect username or password.", //send an appropriate message
          });
      }

      //If no errors are detected, return the done call-back where the user 
      return done(null, user);
    } catch (error) { //Catch errors
      return done(error); //Return done call-back and render the error
    }
  })
)

//PER 3 Google Strategy - ACTIVATE AFTER GOOGLE OAUTH SETUP

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            username: profile.emails[0].value,
            googleId: profile.id,
          });
        }
        await newUser.save();

        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);



//implement the github strategy - OPTIONAL

//PER 3 Passport authenticates the user and determines what data should be stored in the session. Typically, this is the user ID or any other unique identifier. This identifier is saved in the session to keep track of the logged-in user.
// Reduces the size of the session data by storing only the id

//PER 3 Passport callback function done that you call to signal that you're finished serializing the user. It takes two arguments:
// 1. error if there is one, or null
// 2. identifier for the user
passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
//PER 3
// This is called on every request that contains a session.
// Ensures that the user object is reloaded from the database on each request, which helps keep user data up-to-date
// It is used to retrieve user object on the identifier stored in the session. This user is then attached to the "req.user" property.
passport.deserializeUser(async (id, done) => {
try {
    // findById no longer accepts a callback,
    // so we have to do an async call with try/catch blocks
    const user = await User.findById(id);

    done(null, user);
} catch (error) {
    done(error);
}
});