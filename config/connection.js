//NO TOUCHY FROM NOW ON
//summon mongoose
const mongoose = require("mongoose")

//Call an asynchronous function called main:
async function main() {
    //where inside the function body, stage a try-catch statement
    try {
        //in the try, await to tell mongoose to connect to the database URL
        await mongoose.connect(process.env.DB_URL)

        //send a console.log to the server when it starts to establish database connection
        console.log("The database server is now connected")
    } catch (error) { //For catch statements, make sure that you have the error passed as a parameter
        //send a console.log to the server when it starts if the database connection fails, and log the error
        //console.error(`Server failure, error is: ${error}`)
        next(error)
    }
}
//call the function to do dat job!!!!
main()