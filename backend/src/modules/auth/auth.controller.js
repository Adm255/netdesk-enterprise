const { registerUser } = require("./auth.service");
const { validateRegister } = require("./auth.validation");

const register = async (req, res) => {
  try {
    const validation = validateRegister(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: user
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register
};