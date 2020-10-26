const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "../../db/contacts.json");

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
    const newContactsAfterDelete = await contacts.filter(contact => {
      parseInt(contactId) !== contact.id;
    });
    await fsPromises.writeFile(
      contactsPath,
      JSON.stringify(newContactsAfterDelete),
    );
  },

  addContact: async function (name, email, phone) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const newAddContact = {
      id: contacts.length + 1,
      name: `${name}`,
      email: `${email}`,
      phone: `${phone}`,
    };
    await contacts.push(newAddContact);

    await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));

    return newAddContact;
  },

  updateContact: async function (contactId, ...rest) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const id = +contactId - 1;

    contacts[id] = await {
      ...contacts[id],
      ...rest[0],
    };

    await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));
    return contacts[id];
  },
};
