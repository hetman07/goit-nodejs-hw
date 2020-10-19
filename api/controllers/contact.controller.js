const ErrorMessage = require("../errors/ErrorMessage");
const methodContact = require("../../contacts");

class ContactController {
  //TODO: задокументировать каждую функцию
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

  async addContact(req, res) {
    const { name, email, phone } = req.body;
    const newContact = await methodContact.addContact(name, email, phone);
    console.log("newContact: ", newContact);
    return res.status(201).json(newContact);
  }
}

module.exports = new ContactController();
