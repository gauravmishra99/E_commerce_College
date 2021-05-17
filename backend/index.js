const express = require("express");
require("./db/mongoose");
const customerRouter = require("./routers/customer");
const sellerRouter = require("./routers/seller");

const app = express();

app.use(express.json());
app.use(customerRouter);
app.use(sellerRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
