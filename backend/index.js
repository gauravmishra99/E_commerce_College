const express = require("express");
require("./db/mongoose");
var cors = require("cors");
const customerRouter = require("./routers/customer");
const sellerRouter = require("./routers/seller");
const paymentRouter = require("./routers/payment");
var cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(customerRouter);
app.use(sellerRouter);
app.use(paymentRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
