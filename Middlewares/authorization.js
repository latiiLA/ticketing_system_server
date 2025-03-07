const isUserAuthorized =
  (authorizedRole = "USER") =>
  (req, res, next) => {
    console.log("checking authorization role:", authorizedRole);
    try {
      let user = req.auth_user;
      // console.log("inside authorization", { user });

      // Check if user role matches the authorizedRole
      if (user.role === authorizedRole) {
        req.auth_user = user;
        next();
        return;
      } else {
        return res.status(403).json({ message: "User not authorized" });
      }
    } catch (error) {
      // In case of any error, respond with a 403 status
      return res.status(403).json({ message: "User not authorized" });
    }
  };

const isAuthorized =
  (authorizedRole = "ADMIN") =>
  (req, res, next) => {
    console.log("checking authorization role:", authorizedRole);
    try {
      let user = req.auth_user;
      // console.log("inside authorization", { user });

      // Check if user role matches the authorizedRole
      if (user.role === authorizedRole) {
        req.auth_user = user;
        next();
        return;
      } else {
        return res.status(403).json({ message: "User not authorized" });
      }
    } catch (error) {
      // In case of any error, respond with a 403 status
      return res.status(403).json({ message: "User not authorized" });
    }
  };

export { isUserAuthorized, isAuthorized };
