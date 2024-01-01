const express = require("express");
const app = express();
const path = require("path");
app.use(express.static("./dist"));
app.all("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});
app.listen(process.env.PORT || 4005, (_) => console.log("started at 4005"));
