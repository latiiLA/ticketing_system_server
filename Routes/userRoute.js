import express from "express";
const app = express();
const router = express.Router();

import { createUser, loginUser } from "../Controllers/userController.js";
import isAuthenticated from "../Middlewares/authenticate.js";
// import { isAuthorized } from "../Middlewares/authorization.js";

// CREATE USER
router.route("/signup").post(createUser);
// Login
router.route("/login").post(loginUser);

export default router;
