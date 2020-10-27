const express = require("express");
const ContactController = require("./contact.controller");

const router = express.Router();

router.get("/", ContactController.getContacts);
router.get(
  "/:contactId",
  ContactController.validateId,
  ContactController.getById,
);
router.post(
  "/",
  ContactController.validateAddContact,
  ContactController.addContact,
);
router.delete(
  "/:contactId",
  ContactController.validateId,
  ContactController.deleteId,
);
router.patch(
  "/:contactId",
  ContactController.validateId,
  ContactController.validateUpdateContact,
  ContactController.updateId,
);

module.exports = router;
