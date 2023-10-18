const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Baby Toys Server is Running");
});

app.listen(port, () => {
  console.log(`Baby toys server on this port: ${port}`);
});
