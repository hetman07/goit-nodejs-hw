// index.js
const yargs = require("yargs");
const methodContacts = require("./contacts.js");

const argv = yargs
  .number("id")
  .string("action")
  .string("name")
  .string("email")
  .string("phone").argv;

// TODO: рефакторить
function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      methodContacts.listContacts();
      break;

    case "get":
      methodContacts.getContactById(id);
      break;

    case "add":
      methodContacts.addContact(name, email, phone);
      break;

    case "remove":
      console.log(methodContacts.removeContact(id));
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
