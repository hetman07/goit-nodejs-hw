const express = require("express");
const ContactController = require("../controllers/contact.controller");

const router = express.Router();

//GET /api/contacts
//GET /api/contacts/:contactId
//POST /api/contacts
//DELETE /api/contacts/:contactId
//PATCH /api/contacts/:contactId

router.get("/", ContactController.listContacts);

module.exports = router;
