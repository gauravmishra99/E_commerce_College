const express = require("express");
const Customer = require("../models/customer");
const router = new express.Router();
const customerAuth = require("../middlewares/customerAuth");
const Order = require("../models/order");
const Item = require("../models/items");

//router for customer signup
router.post("/users/customers", async (req, res) => {
  const customer = new Customer(req.body);

  try {
    await customer.save();
    const token = await customer.generateAuthToken();
    res.status(201).send({ customer, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//route for customer login
router.post("/users/customers/login", async (req, res) => {
  try {
    const customer = await Customer.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await customer.generateAuthToken();
    res.send({ customer, token });
  } catch (e) {
    res.status(400).send();
  }
});

//route for customer logout
router.post("/users/customers/logout", customerAuth, async (req, res) => {
  try {
    req.customer.tokens = req.customer.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.customer.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//route for customer getting items by category
router.get("/items/:category", customerAuth, async (req, res) => {
  const category = req.params.category;

  try {
    const items = await Item.find({ category });
    if (!items) {
      return res.status(404).send();
    }
    res.send(items);
  } catch (e) {
    res.status(500).send();
  }
});

//route for customer getting items by id
router.get("/itemsid/:id", customerAuth, async (req, res) => {
  const _id = req.params.id;
  try {
    const item = await Item.findOne({ _id });
    if (!item) {
      return res.status(404).send();
    }
    res.send(item);
  } catch (e) {
    res.status(500).send();
  }
});

//route for customer Checkout
router.post("/users/customers/checkout", customerAuth, async (req, res) => {
  const ordersByCustomer = [];
  const flag = 0;
  try {
    const orders = req.body;
    let totalAmount = 0;
    await orders.reduce(async (memo, order) => {
      await memo;
      const _id = order.id;
      const temp = await Item.findOne({ _id });
      console.log(temp)
      const stock = temp.stock;
      if (stock === 0) {
        flag = 1;
        throw new Error();
      }
      temp.stock = stock - 1;
      const price = temp.price;
      const seller = temp.seller;
      const itemid = temp._id;
      const retur = temp.returnValid;
      const item = { price, seller, itemid, status: "ordered", returnValid: retur };
      totalAmount += price;
      await temp.save();
      ordersByCustomer.push(item);
    }, undefined);
    const datePlacedOn = new Date();
    const order = new Order({
      items: ordersByCustomer,
      placedBy: req.customer._id,
      totalAmount,
      datePlacedOn,
    });
    await order.save();
    res.status(200).send(order);
  } catch (e) {
    for (let index = 0; index < ordersByCustomer.length; index++) {
      const order = ordersByCustomer[index];
      const _id = order.itemid;
      const temp = await Item.findOne({ _id });
      const stock = temp.stock;
      temp.stock = stock + 1;
      await temp.save();
    }
    res.status(500).send(e);
  }
});

//route for cancelling the order

router.post("/users/cancel/:orderid", customerAuth, async (req, res) => {
  const orderid = req.params.orderid;
  const itemid = req.body.id;
  try {
    const order = await Order.findOne({ _id: orderid });
    const items = order.items;
    items.forEach((item) => {
      if (String(item._id) === itemid) {
        item.status = "cancelled";
      }
    });
    await order.save();
    res.status(200).send(order);
  } catch (e) {
    res.status(500).send();
  }
});

//route to cancel all items of a particular orderid

//route to return item

router.post("/users/return/:orderid", customerAuth, async (req, res) => {
  const orderid = req.params.orderid;
  const itemid = req.body.id;
  try {
    const order = await Order.findOne({ _id: orderid });
    const currentDate = new Date()
    const orderPlacedOn = order.datePlacedOn
    const items = order.items;
    items.forEach((item) => {
      if (String(item._id) === itemid) {
        const returnValid = item.returnValid
        //if orderplaceOn date + validity period is less than or equal to current date
        if(orderPlacedOn.getTime()+(returnValid*24*60*60*1000) <= currentDate.getTime()){
          throw new Error({message: 'Return period has expired'})
        }

        //send notification to seller to initiate return  TODO
      }
    });
    const message = 'Return would be initiated by the seller'
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

//route to return all items of a particular orderid

module.exports = router;
