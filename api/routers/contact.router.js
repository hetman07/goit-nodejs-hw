const express = require("express");
const ContactController = require("../../api/controllers/contact.controller");

const router = express.Router();

router.get("/", ContactController.getContacts);
router.get("/:contactId", ContactController.getById);
router.post(
  "/",
  ContactController.validateAddContact,
  ContactController.addContact,
);
router.delete("/:contactId", ContactController.deleteId);
router.patch(
  "/:contactId",
  ContactController.validateUpdateContact,
  ContactController.updateId,
);
module.exports = router;
