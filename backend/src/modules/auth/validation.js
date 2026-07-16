const validateRegister = (body) => {
  const { firstName, lastName, email, password } = body;

  if (!firstName || !lastName || !email || !password) {
    return {
      valid: false,
      message: "All required fields must be provided."
    };
  }

  return { valid: true };
};

const validateLogin = (body) => {
  const { email, password } = body;

  if (!email || !password) {
    return {
      valid: false,
      message: "Email and password are required."
    };
  }

  return { valid: true };
};

module.exports = {
  validateRegister,
  validateLogin
};