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

module.exports = {
  validateRegister
};