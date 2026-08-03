const {
  getDashboardStatistics
} = require("./service");

const getStats = async (req, res) => {
  try {
    const stats = await getDashboardStatistics();

    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getStats
};