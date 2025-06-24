//NO TOUCHY FROM NOW ON
const siteData = require("../data/siteData");

const SubmitProtest = require("../models/submitprotestModel");



const createSubmitProtest = async (request, response, next) => {
  const { location, date, time, description } = request.body;
  try {
    //Required Value Check from Model: if the required information (title, author, price, and starRating) are not present, we need to handle errors early before we proceed within our try statement.
    if (!location || !date|| !time || !description) {
      throw new Error("Missing required fields, please review.");
    }

    //Now, we're going to create a new Book constructor using the new keyword
    const newSubmitProtest = new SubmitProtest({
     location,
     date, 
     time, 
     description,
    });

    //Refactor from pushing new entries from the bookInventory and instead, await the newBook's information and save it using the save method.
    await newSubmitProtest.save()

    return response.status(201).json({
      success: { message: "A new protest update was submitted" },
      data: { newSubmitProtest },
      statusCode: 201 //add a status code for confirmation
    });
  } catch (error) { //refactor the error statement to catch the next error.
    return next(error)
  }
};

const updateSubmitProtest = async (request, response, next) => {
  const { _id } = request.params;
  const { location, date, time, description } = request.body;
  try {
    //Required Value Check from Model: if the required information (title, author, price, and starRating) are not present, we need to handle errors early before we proceed within our try statement.
    if (!location || !date|| !time|| !description) {
      throw new Error("Missing required fields, please review.");
    }
    //upgrade the object to await for the Book model to be found via the findByIdAndUpdate method, with three parameters, _id, an object using the set method on the form parameters and {new: true}
    const updatedSubmitProtest = await SubmitProtest.findByIdAndUpdate(
      _id,
      {
        $set: {
          location,
          date,
          time,
          description,
        }
      },
      {new: true}
    );
    //Update Book Check: if for some reason, the book was not updated (or can't be found), use the throw command with the new keyword on an Error constructor and write a message that says "Book not found".
    if (!updatedSubmitProtest) {
      throw new Error("Event not found");
    }
    return response.status(201).json({
      success: { message: "The book is updated" },
      data: { updatedSubmitProtest },
      statusCode: 201 //add a status code for confirmation
    });
  } catch (error) { //refactor the error statement to catch the next error.
    return next(error)
  }
};

const deleteSubmitProtest = async (request, response, next) => {
  const { _id } = request.params;

  try {
    // ID Check: if there is not an Id found, we will use the throw command with a new Error constructor object, and a string that states: "Id is required"
    if (!_id) {
      throw new Error("Id is required");
    }

    //upgrade to await for the Book model to be found via the findByIdAndDelete method, with the parameter of _id
    await SubmitProtest.findByIdAndDelete(_id);

    return response.status(200).json({
      success: { message: "Event deleted" },
      statusCode: 200 //add a status code for confirmation
    });
  } catch (error) { //refactor the error statement to catch the next error.
    return next(error)
  }
};

module.exports = { createSubmitProtest, updateSubmitProtest, deleteSubmitProtest };