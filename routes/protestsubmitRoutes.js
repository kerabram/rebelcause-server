

const express = require("express");
const router = express.Router();

const { createSubmitProtest, updateSubmitProtest, deleteSubmitProtest} = require("../controllers/submitprotestController");

//All routes start with "/api/books/" --> //http://localhost:3000/api/books

router.post("/create/new", createSubmitProtest); //http://localhost:3000/api/books/create/new
 
router.put("/update/:_id", updateSubmitProtest); //http://localhost:3000/api/books/update/:_id

router.delete("/delete/:_id", deleteSubmitProtest); //http://localhost:3000/api/books/delete/:_id

module.exports = router;

router.post("/api/submitprotest/create/new")

