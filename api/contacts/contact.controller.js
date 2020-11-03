const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");

const ContactModel = require("./contact.model");
const aggregateQuery = ContactModel.aggregate();

const ErrorMessage = require("../errors/ErrorMessage");
const ErrorAddContact = require("../errors/ErrorAddContact");

// const myCustomLabels = {
//   totalDocs: "itemCount",
//   docs: "itemsList",
//   limit: "perPage",
//   page: "currentPage",
//   nextPage: "next",
//   prevPage: "prev",
//   totalPages: "pageCount",
//   pagingCounter: "slNo",
//   meta: "paginator",
// };

const options = {
  page: 1,
  limit: 20,
  sort: { subscription: 1 },
  //customLabels: myCustomLabels,
};

class ContactController {
  //вытянуть все контакты
  // async getContacts(req, res) {
  //   console.log("limit: ", limit);

  //   const contacts = await ContactModel.find();

  //   return res.status(200).json(contacts);
  // }
  //вытянуть отсортированные контакты с пагинацией
  async getContacts(req, res, next) {
    try {
      const {
        limit: limitQuery,
        page: pageQuery,
        sub: subscriptionQuery,
      } = req.query;
      console.log(limitQuery, pageQuery, subscriptionQuery);

      if (!limitQuery && !pageQuery && !subscriptionQuery) {
        const contacts = await ContactModel.find();

        return res.status(200).json(contacts);
      } else if ((limitQuery || pageQuery) && !subscriptionQuery) {
        const contacts = await ContactModel.paginate(
          {},
          { page: pageQuery || 1, limit: limitQuery || 10 },
          function (err, result) {
            return result.docs;
          },
        );

        console.log("contacts: ", contacts);
        return res.status(200).json(contacts);
      } else if (subscriptionQuery && !limitQuery && !pageQuery) {
        const contacts = await ContactModel.find({
          subscription: subscriptionQuery,
        });

        console.log("contacts: ", contacts);
        return res.status(200).json(contacts);
      } else {
        return res.status(404).json({ message: "It is wrong params" });
      }
    } catch (err) {
      next(err);
    }
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
  //удаление контакта
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
  //обновление контакта
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
  //валидация коректного id проверка его на тип
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
