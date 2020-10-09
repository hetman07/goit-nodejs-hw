const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

// TODO: задокументировать каждую функцию
function listContacts() {
  const data = fs.readFileSync(contactsPath, "utf-8");
  return JSON.parse(data);
}
// listContacts();

function getContactById(contactId) {
  const users = listContacts();
  const idFound = users.filter((contact) => {
    if (contactId && contactId !== contact.id) {
      return false;
    }
    return true;
  });
  console.log(idFound);
  return idFound;
}
// getContactById(2);

function removeContact(contactId) {
  const users = listContacts();
  const idFound = users.filter((contact) => {
    if (contactId && contactId === contact.id) {
      return false;
    }
    return true;
  });
  console.log(idFound);
  return fs.writeFileSync(contactsPath, JSON.stringify(idFound));
}
removeContact(10);
listContacts();
// function addContact(name, email, phone) {
//   // ...твой код
// }
