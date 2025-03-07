import express from "express";
const app = express();
const router = express.Router();

import {
  createTicket,
  createUser,
  loginUser,
  getMyTickets,
  getAllTickets,
  editTicket,
} from "../Controllers/userController.js";
import isAuthenticated from "../Middlewares/authenticate.js";
import {
  isAuthorized,
  isUserAuthorized,
} from "../Middlewares/authorization.js";

// CREATE USER
router.route("/signup").post(createUser);
// Login
router.route("/login").post(loginUser);
// Create ticket
router
  .route("/tickets")
  .post(isAuthenticated, isUserAuthorized(), createTicket);
// Edit ticket
router.route("/tickets/:id").put(isAuthenticated, isAuthorized(), editTicket);
// Get my tickets for user
router
  .route("/mytickets")
  .get(isAuthenticated, isUserAuthorized(), getMyTickets);
// Get all tickets for admin
router.route("/alltickets").get(isAuthenticated, isAuthorized(), getAllTickets);

export default router;
