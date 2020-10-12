const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");
module.exports = {
  // TODO: задокументировать каждую функцию
  listContacts: async function () {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const users = await JSON.parse(data);
    return console.log(users);
  },

  getContactById: async function (contactId) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const users = await JSON.parse(data);
    const idFound = users.filter((contact) => {
      if (contactId && contactId !== contact.id) {
        return false;
      }
      return true;
    });
    return console.log(idFound);
  },

  removeContact: async function (contactId) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const users = await JSON.parse(data);
    const idFound = users.filter((contact) => {
      if (contactId && contactId === contact.id) {
        return false;
      }
      return true;
    });
    const newData = await fsPromises.writeFile(
      contactsPath,
      JSON.stringify(idFound)
    );
    return console.log(newData);
  },

  addContact: async function (name, email, phone) {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const users = await JSON.parse(data);
    await users.push({
      id: users.length + 1,
      name: `${name}`,
      email: `${email}`,
      phone: `${phone}`,
    });

    await fsPromises.writeFile(contactsPath, JSON.stringify(users));

    return console.log(users);
  },
};
