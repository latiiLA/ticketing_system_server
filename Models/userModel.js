import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter firstName."],
      uppercase: true,
    },
    lastName: {
      type: String,
      required: [true, "Please enter lastName."],
      uppercase: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Please enter email."],
    },
    role: {
      type: String,
      uppercase: true,
      required: [true, "Please enter role"],
      enum: ["USER", "ADMIN"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      trim: true,
      select: false,
    },
    // createdBy: {
    //   type: mongoose.Types.ObjectId,
    //     required: [true, "Creater user id is required"],
    // },
    status: {
      type: String,
      default: "New",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: mongoose.Types.ObjectId,
    },
    wrongPasswordCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
