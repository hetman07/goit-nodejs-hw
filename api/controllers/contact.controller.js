const Joi = require("joi");

const ErrorMessage = require("../errors/ErrorMessage");
const ErrorAddContact = require("../errors/ErrorAddContact");
const methodContact = require("../controllers/contacts");

class ContactController {
  async getContacts(req, res) {
    const contacts = await methodContact.listContacts();
    return res.status(200).json(contacts);
  }

  async getById(req, res, next) {
    try {
      const { contactId } = req.params;

      const findId = await methodContact.getContactById(contactId);
      if (!findId) {
        throw new ErrorMessage();
      }
      return res.status(200).json(findId);
    } catch (err) {
      next(err);
    }
  }

  async addContact(req, res, next) {
    try {
      const { name, email, phone } = req.body;
      const newContact = await methodContact.addContact(name, email, phone);
      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }
  }

  validateAddContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      throw new ErrorAddContact();
    }
    next();
  }

  async deleteId(req, res, next) {
    try {
      const { contactId } = req.params;

      const findId = await methodContact.getContactById(contactId);
      if (!findId) {
        throw new ErrorMessage();
      }
      const deleteContact = await methodContact.removeContact(contactId);
      return res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  async updateId(req, res, next) {
    try {
      const { contactId } = req.params;
      const { name, email, phone } = req.body;
      console.log("...req.body", req.body);
      const findId = await methodContact.getContactById(contactId);
      if (!findId) {
        throw new ErrorMessage();
      }
      const updContact = await methodContact.updateContact(contactId, req.body);

      return res.status(200).json(updContact);
    } catch (err) {
      next(err);
    }
  }

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      throw new ErrorAddContact();
    }
    next();
  }
}

module.exports = new ContactController();
