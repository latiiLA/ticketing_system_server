import mongoose from "mongoose";

const ticketSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter firstName."],
    },
    description: {
      type: String,
      required: [true, "Please enter lastName."],
    },
    status: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "Creater user id is required"],
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
