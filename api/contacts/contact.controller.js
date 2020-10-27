const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");

const ContactModel = require("./contact.model");

const ErrorMessage = require("../errors/ErrorMessage");
const ErrorAddContact = require("../errors/ErrorAddContact");
const methodContact = require("./contact.method");

class ContactController {
  //вытянуть все контакты
  async getContacts(req, res) {
    const contacts = await ContactModel.find();
    return res.status(200).json(contacts);
  }
  //поиск контакта по id
  async getById(req, res, next) {
    try {
      const { contactId } = req.params;

      const findId = await ContactModel.findById(contactId);
      if (!findId) {
        throw new ErrorMessage();
      }
      return res.status(200).json(findId);
    } catch (err) {
      next(err);
    }
  }
  //добавление нового контакта
  async addContact(req, res, next) {
    try {
      const newContact = await ContactModel.create(req.body);
      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }
  }

  validateAddContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string(),
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

      const deleteContactById = await ContactModel.findByIdAndDelete(contactId);
      if (!deleteContactById) {
        throw new ErrorMessage();
      }

      return res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  async updateId(req, res, next) {
    try {
      const { contactId } = req.params;

      const updateContactById = await ContactModel.findByIdAndUpdate(
        contactId,
        {
          $set: req.body,
        },
        {
          new: true,
        },
      );
      if (!updateContactById) {
        throw new ErrorMessage();
      }
      return res.status(200).json(updateContactById);
    } catch (err) {
      next(err);
    }
  }

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      throw new ErrorAddContact();
    }
    next();
  }

  validateId(req, res, next) {
    const {
      params: { contactId },
    } = req;

    if (!ObjectId.isValid(contactId)) {
      return res.status(404).json({ message: "Id is not valid" });
    }

    next();
  }
}

module.exports = new ContactController();
