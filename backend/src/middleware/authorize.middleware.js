const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.roleId;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action."
      });
    }

    next();
  };
};

module.exports = {
  authorize
};