const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");

class ContactController {
  // TODO: задокументировать каждую функцию
  //   async listContacts(req, res, next) {
  //     const data = await fsPromises.readFile(contactsPath, "utf-8");
  //     const users = JSON.parse(data);
  //     console.log(typeof users);
  //     return console.log(typeof users);
  //   }

  listContacts() {
    return console.log("hello world!");
  }

  //   getContactById: async function (contactId) {
  //     const data = await fsPromises.readFile(contactsPath, "utf-8");
  //     const users = await JSON.parse(data);
  //     const idFound = users.filter(contact => {
  //       if (contactId && contactId !== contact.id) {
  //         return false;
  //       }
  //       return true;
  //     });
  //     return console.table(idFound);
  //   },

  //   removeContact: async function (contactId) {
  //     const data = await fsPromises.readFile(contactsPath, "utf-8");
  //     const users = await JSON.parse(data);
  //     const idFound = await users.filter(contact => {
  //       if (contactId && contactId === contact.id) {
  //         return false;
  //       }
  //       return true;
  //     });

  //     return console.table(idFound);
  //   },

  //   addContact: async function (name, email, phone) {
  //     const data = await fsPromises.readFile(contactsPath, "utf-8");
  //     const users = await JSON.parse(data);
  //     await users.push({
  //       id: users.length + 1,
  //       name: `${name}`,
  //       email: `${email}`,
  //       phone: `${phone}`,
  //     });

  //     await fsPromises.writeFile(contactsPath, JSON.stringify(users));

  //     return console.table(users);
  //   },
}

module.exports = new ContactController();
