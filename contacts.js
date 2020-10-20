const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");
module.exports = {
  // TODO: задокументировать каждую функцию
  listContacts: async function () {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  },

  getContactById: async function (contactId) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const idFound = await contacts.find(contact => {
      return parseInt(contactId) === contact.id;
    });
    return idFound;
  },

  removeContact: async function (contactId) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const idFound = await contacts.filter(contact => {
      if (parseInt(contactId) === contact.id) {
        return false;
      }
      return true;
    });

    return console.table(idFound);
  },

  addContact: async function (name, email, phone) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    await contacts.push({
      id: contacts.length + 1,
      name: `${name}`,
      email: `${email}`,
      phone: `${phone}`,
    });

    await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));

    return contacts;
  },

  updateContact: async function (contactId, name, email, phone) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const id = +contactId;
    console.log("id", id);

    const updContact = await contacts.find(contact => {
      return parseInt(contactId) === contact.id;
    });
    const newDateContact = {
      id: contactId,
      ...rest,
    };
    console.log("updContact", updContact);
    console.log("newDateContact", newDateContact);
    updContact = newDateContact;
    return contacts;
  },
};
