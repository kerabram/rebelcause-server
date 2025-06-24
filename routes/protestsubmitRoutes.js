

const express = require("express");
const router = express.Router();

const { getAllProtestSubmissions, getSingleProtest, createSubmitProtest, updateSubmitProtest, deleteSubmitProtest} = require("../controllers/submitprotestController");

//All routes start with "/api/submitprotest/" --> //http://localhost:3000/api/submitprotest/
router.get("/", getAllProtestSubmissions); //http://localhost:3000/api/submitprotest/

router.get("/:_id", getSingleProtest); //http://localhost:3000/api/submitprotest/:_id

router.post("/create/new", createSubmitProtest); //http://localhost:3000/api/submitprotest/create/new
 
router.put("/update/:_id", updateSubmitProtest); //http://localhost:3000/api/submitprotest/update/:_id

router.delete("/delete/:_id", deleteSubmitProtest); //http://localhost:3000/api/submitprotest/delete/:_id

module.exports = router;

