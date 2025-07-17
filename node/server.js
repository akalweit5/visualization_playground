const express = require("express");
const app = express();
const port = 3000;

// Serve all files from public/
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});