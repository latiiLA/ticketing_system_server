import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// create json web token
const maxAge = 1 * 24 * 60 * 60;
export const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

const createUser = async (req, res) => {
  try {
    // let createdBy = req.auth_user._id;
    console.log(req.body, "the request has reached backend.");
    const { firstName, lastName, email, role, password, confirmPassword } =
      req.body;

    if (password !== confirmPassword) {
      console.log("doesn't match password");
      return res.status(400).json({ message: "Password does not match." });
    }

    // Check for existing email and username, including soft-deleted users
    const existingUser = await User.findOne({ email });

    if (existingUser && !existingUser.isDeleted) {
      console.log("email already exists");
      return res.status(409).json({ message: "Email already in use" });
    }

    // If the email exists but is soft-deleted, reactivate the user
    if (existingUser && existingUser.isDeleted) {
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.role = role;
      existingUser.password = await bcrypt.hash(password, 13); // Rehash the password
      existingUser.isDeleted = false;
      //   existingUser.createdBy = createdBy;

      // Save the reactivated user
      await existingUser.save();

      console.log("User reactivated successfully:", existingUser);
      return res.status(200).json({
        status: "success",
        user: existingUser,
        message: "User reactivated successfully.",
      });
    }

    // Hash the password for a new user
    const hashPassword = await bcrypt.hash(password, 13);
    console.log("Hashed password:", hashPassword);

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      password: hashPassword,
      //   createdBy,
    });

    // Respond with success
    console.log("User created successfully:", user);
    return res.status(201).json({
      status: "success",
      user,
      message: "User created successfully.",
    });
  } catch (error) {
    console.error("Error creating a user:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while creating the user.",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("request reached backend", email, password);

    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // // SQL injection attach protection
    // if (!emailPattern.test(email)) {
    //   return res.status(400).json({ message: "Invalid email format" });
    // }
    console.log("request reached backend", email, password);

    const user = await User.findOne({
      email: email,
      isDeleted: false,
    }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    }

    if (user.wrongPasswordCount > 5) {
      return res.status(401).json({
        message: "Your account is locked! Please contact your administrator.",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      // res.send("wrong password");
      user.wrongPasswordCount += 1;
      await user.save();
      console.log("password is not correct.");
      return res.status(401).json({
        message: `Wrong password! You are left with ${
          5 - user.wrongPasswordCount
        } tries.`,
      });
    }

    user.wrongPasswordCount = 0;
    await user.save();

    // Login successful
    // Generate JWT token or set session
    // Return response
    const token = createToken(user);

    res.header("token", token);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    return res.status(200).json({
      token: token,
      message: "User logged in successfully",
      data: user,

      // console.log(user);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while logging in the user.",
    });
  }
};

export { createUser, loginUser };
