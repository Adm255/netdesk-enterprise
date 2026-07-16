const {
  registerUser,
  loginUser
} = require("./service");

const {
  validateRegister,
  validateLogin
} = require("./validation");

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

const login = async (req, res) => {
  try {
    const validation = validateLogin(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const result = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token: result.token,
      user: result.user
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};