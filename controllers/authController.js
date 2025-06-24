//NEW: Define passport and bcrypt for auth
const passport = require("passport");
const bcrypt = require("bcrypt");

//Define the User Model
const User = require("../models/userModel");

//REVIEW/NEW MATERIAL - //PER 2
const register = async (request, response, next) => {
  const { alias, email, area, password , } = request.body;
  console.log(request.body);
  //Error handling 
    if (error) {
        return next(error);
    } else if (!alias || !email|| !area|| !password) { // Confirm required fields are not empty before any other work
      return response.status(400).json({
        error: { message: "Missing required fields." },
        statusCode: 400,
      });
    }

  try {
    //Make some "salty hash browns" here in Authentication.
    const hashedPassword = await bcrypt.hash(password, 10); //(myPlaintextPassword, saltRounds);
    //Technique (auto-gen a salt and hash): store the hashedPassword and tell bcrypt to await hashing, where we will convert the password using 10 rounds of salt.  
    // Store hash in your password DB.

    const newUser = {
      alias: alias,
      email: email,
      area: area,
      password: hashedPassword, //upgrade password to hashedPassword
      //more advanced auth... target the Google and/or GitHub IDs for user auth
      googleId: googleId,
      githubId: githubId //Again, this is optional

    };

    //NEW: Await the newUser's information to be registered in the database and save the model of the user within MongoDB (simply add the await keyword)
    await newUser.save();

    //NEW: Call the mockPassport function to check login. Move the code inside of the object within the skeleton
    request.login(newUser, (error) => {
      //Stage an if statement to catch errors
      if (error) {
        return next(error);
      }
    })

    // Yusuf: AFTER user is saved AND logged in, we can change the password to undefined. Luckily, our database, MongoDB, by default will not send any undefined values in the response.
    newUser.password = undefined;

    return response.status(201).json({
      success: { message: "New user is created" },
      data: { newUser },
      statusCode: 201,
    });
  } catch (error) {
    //NOW:  //Refactor error handling to simply return the next error 
    return next(error)
    //BEFORE: OK, but excessive
    // return response.status(500).json({
    //   error: { message: "Internal server error" },
    //   statusCode: 500,
    // });
  }
};

//NO TOUCHY FROM NOW ON
const login = async (request, response, next) => {
  response.status(200).json({
    success: { message: "User logged in." },
  });
};

//REVIEW/NEW MATERIAL  - //PER 2
const localLogin = async (request, response, next) => {

   //NEW: remame mockPassport to use the passport.authenticate method
  passport.authenticate("local", (err, user, info) => { //we'll target the "local" strategy, errors, user and information
    //error handling as a final check and a failsafe
    if (err) {
      return next(err);
    }

    //if there is not a user detected
    //Error handling can be reactivated in the auth unit.
        if (!user) {
            return response.status(401).json({
                error: { message: "There is not a user detected. Please try again." },
            });
        }

        //use the login method to confirm the user
        request.login(user, (err) => {
            
            //Kit: error handling a second time to re-confirm
            if (err) {
                return next(err)
            }
            //5.1 Per 4 Code //We'll create a copy of the user by destructuring the request of the user's id and set the user's copied password to undefined for security.
            const userCopy = { ...req.user._doc };
            userCopy.password = undefined;
            console.log(userCopy)
            //Log the user copied data.
            

            //Yusuf: Send the response in the login function. This will wait for it to complete. If not in here, possible errors, being sent before login function completed
            response.status(200).json({
                success: { message: "Login successful within local authentication feature." },
                //Reference the user copied data with a key of data and a value as an object with a secondary key of user and the secondary value being the userCopy.
                data: {user:userCopy}
            });
        })

  }) //add an ending parenthesis here


  //Kit: You can disable this code, since it's handled by passport
  // response.status(200).json({
  //   success: { message: "Login successful." },
  //   data: { user: userCopy },
  //   result: result,
  // });
};

//REVIEW/NEW MATERIAL  - //PER 2
const logout = async (request, response, next) => {
  
   //Kit: use the logout method to logout the user, destroy the session, clean up cookies from the browser and then return a response after cleaning up. This helps protect sessions, especially if as a developer, you walk away from your project, and you don't want anyone else accessing sensitive information after you.

    request.logout((err) => {
        if (err) {
          return next(err);
        }

        // destroy the session on logout so unauthorized calls will be blocked
        request.session.destroy((err) => {
            if (err) {
                return next(err);
            }
        })
        // Clear the cookie from the browser
        response.clearCookie("connect.sid");
        return response.status(200).json({
            success: { message: "User logged out!" },
            statusCode: 200, //return the status code
        });
    })
}

module.exports = { register, login, logout, localLogin };