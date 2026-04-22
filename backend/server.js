const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("node:dns/promises");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

dns.setServers(["1.1.1.1", "1.0.0.1"]);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/product"));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});