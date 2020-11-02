const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
    default: "",
  },
});

ContactSchema.plugin(mongoosePaginate);

const myCustomLabels = {
  totalDocs: "itemCount",
  docs: "itemsList",
  limit: "perPage",
  page: "currentPage",
  nextPage: "next",
  prevPage: "prev",
  totalPages: "pageCount",
  pagingCounter: "slNo",
  meta: "paginator",
};

const options = {
  page: 1,
  limit: 20,
  customLabels: myCustomLabels,
};

ContactSchema.paginate({}, options, function (err, result) {
  // result.itemsList [here docs become itemsList]
  // result.paginator.itemCount = 100 [here totalDocs becomes itemCount]
  // result.paginator.perPage = 10 [here limit becomes perPage]
  result.paginator.currentPage = 1; //[here page becomes currentPage]
  // result.paginator.pageCount = 10 [here totalPages becomes pageCount]
  // result.paginator.next = 2 [here nextPage becomes next]
  // result.paginator.prev = null [here prevPage becomes prev]
  // result.paginator.slNo = 1 [here pagingCounter becomes slNo]
  // result.paginator.hasNextPage = true
  // result.paginator.hasPrevPage = false
});

module.exports = mongoose.model("Contact", ContactSchema);
