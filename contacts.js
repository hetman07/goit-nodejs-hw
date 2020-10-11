const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");
module.exports = {
  // TODO: задокументировать каждую функцию
  listContacts: async function () {
    console.log(await fsPromises.readFile(contactsPath, "utf-8"));
    //return await JSON.stringify(data);
  },

  // listContacts();

  getContactById: function (contactId) {
    const users = listContacts();
    const idFound = users.filter((contact) => {
      if (contactId && contactId !== contact.id) {
        return false;
      }
      return true;
    });
    console.log(idFound);
    return idFound;
  },

  // getContactById(2);

  removeContact: function (contactId) {
    const users = listContacts();
    const idFound = users.filter((contact) => {
      if (contactId && contactId === contact.id) {
        return false;
      }
      return true;
    });
    console.log(idFound);
    return fs.writeFileSync(contactsPath, JSON.stringify(idFound));
  },
  // removeContact(10);
  // listContacts();
  addContact: function (name, email, phone) {
    const users = listContacts();
    const newStr = users.push({
      id: 10,
      name: `${name}`,
      email: `${email}`,
      phone: `${phone}`,
    });
    console.log("users", users);
    return fs.writeFileSync(contactsPath, JSON.stringify(users));
  },
};
// addContact("Dimaa", "dim4eg@gmail.com", "(067)1234567");
