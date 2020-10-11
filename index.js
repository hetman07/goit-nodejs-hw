// index.js
const yargs = require("yargs");
const methodContacts = require("./contacts.js");
console.log(methodContacts.listContacts());
const argv = yargs
  .number("id")
  .string("action")
  .string("name")
  .string("email")
  .string("phone").argv;
console.log(argv);
// TODO: рефакторить
// function invokeAction({ action, id, name, email, phone }) {
//   switch (action) {
//     case "list":
//       // ...
//       break;

//     case "get":
//       // ... id
//       break;

//     case "add":
//       // ... name email phone
//       break;

//     case "remove":
//       // ... id
//       break;

//     default:
//       console.warn("\x1B[31m Unknown action type!");
//   }
// }

// invokeAction(argv);
