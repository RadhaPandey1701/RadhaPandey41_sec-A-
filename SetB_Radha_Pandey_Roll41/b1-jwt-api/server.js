/**
 * Server entry point - Practical B1
 * Name: Radha Pandey | B.Tech CSE | Roll No: 41
 */
const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`B1 JWT API running on http://localhost:${PORT}`);
  console.log("Developed by Radha Pandey (B.Tech CSE, Roll No 41)");
});
