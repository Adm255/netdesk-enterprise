const {
  getTicketStatistics,
  getUserStatistics,
  getTechnicianWorkload
} = require("./repository");

const getDashboardStatistics = async () => {
  const [
    ticketStatistics,
    userStatistics,
    technicianWorkload
  ] = await Promise.all([
    getTicketStatistics(),
    getUserStatistics(),
    getTechnicianWorkload()
  ]);

  return {
    tickets: ticketStatistics,
    users: userStatistics,
    technicianWorkload
  };
};

module.exports = {
  getDashboardStatistics
};