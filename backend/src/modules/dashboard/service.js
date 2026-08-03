const {
  getTicketStatistics,
  getUserStatistics,
  getTechnicianWorkload
} = require("./repository");

const getDashboardStatistics = async () => {
  const [
    tickets,
    users,
    technicianWorkload
  ] = await Promise.all([
    getTicketStatistics(),
    getUserStatistics(),
    getTechnicianWorkload()
  ]);

  return {
    tickets,
    users,
    technicianWorkload
  };
};

module.exports = {
  getDashboardStatistics
};