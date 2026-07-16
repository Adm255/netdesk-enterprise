require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("==================================");
  console.log(" NetDesk API Started Successfully");
  console.log(` Running on http://localhost:${PORT}`);
  console.log("==================================");
});