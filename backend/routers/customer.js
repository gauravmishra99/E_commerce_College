const express = require("express");
const Customer = require("../models/customer");
const router = new express.Router();
const customerAuth = require("../middlewares/customerAuth");
const Order = require("../models/order");
const Item = require("../models/items");
const Razorpay = require("razorpay");
const Seller = require("../models/seller");

//route for customer signup
router.post("/users/customers", async (req, res) => {
  const customer = new Customer(req.body);

  try {
    await customer.save();
    const token = await customer.generateAuthToken();
    res.cookie("token", token, { httpOnly: true });
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
    res.cookie("token", token, { httpOnly: true });
    res.status(201).send({ customer, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//route for jwt decode
router.post("/users/customers/decode", customerAuth, async (req, res) => {
  try {
    let sent = false;
    req.customer.tokens.forEach((token) => {
      if (token.token === req.cookies.token) {
        sent = true;
      }
    });

    if (sent === false) {
      throw new Error("token not found");
    } else {
      res.send(true);
    }
  } catch (e) {
    res.send(false);
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

//route for getting all items

router.get("/customer/items", customerAuth, async (req, res) => {
  try {
    const items = await Item.find();
    if (!items) {
      return res.status(404).send();
    }
    res.send(items);
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

//route for adding item to Cart
router.post("/addToCart", customerAuth, async (req, res) => {
  try {
    let flag = 0;
    req.customer.cart.map((item) => {
      if (String(item.item) === req.body.item) {
        item.quantity = item.quantity + parseInt(req.body.quantity);
        flag = 1;
      }
    });
    await req.customer.save();
    res.status(201).send();
    if (flag === 0) {
      const tempItem = {
        item: req.body.item,
        quantity: parseInt(req.body.quantity),
      };
      req.customer.cart.push(tempItem);
      await req.customer.save();
      res.status(201).send();
    }
  } catch (e) {
    res.status(500).send();
  }
});

//route for changing quantity items in cart
router.post("/items/change-quantity", customerAuth, async (req, res) => {
  req.customer.cart.map((item) => {
    if (String(item.item) === req.body.id) {
      item.quantity = parseInt(req.body.newValue);
    }
  });
  await req.customer.save();
  res.status(201).send();
});
//route for increasing/deceasing item in cart
router.post(
  "/items/incre-decrement-quantity",
  customerAuth,
  async (req, res) => {
    req.customer.cart.map((item) => {
      if (String(item.item) === req.body.id) {
        item.quantity = item.quantity + parseInt(req.body.change);
      }
    });
    await req.customer.save();
    res.status(201).send();
  }
);

//route for getting all items in cart
router.get("/getItemsInCart", customerAuth, async (req, res) => {
  const CartItems = [];
  const length = req.customer.cart.length;
  try {
    for (let i = 0; i < length; i++) {
      const _id = req.customer.cart[i].item;
      const tempItem = await Item.find(_id);
      const quantity = req.customer.cart[i].quantity;
      CartItems.push({ item: tempItem, quantity });
    }
    res.status(200).send(CartItems);
  } catch (e) {
    res.status(500).send(e);
  }
});

//route for removing item from cart
router.post("/removeItemInCart", customerAuth, async (req, res) => {
  const id = req.body.id;
  const cartItems = req.customer.cart;
  try {
    let cart = cartItems.filter((item) => String(item.item) !== id);
    req.customer.cart = cart;
    await req.customer.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

//route for clearing cart
router.post("/clearCart", customerAuth, async (req, res) => {
  try {
    req.customer.cart = [];
    await req.customer.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

//route for customer Checkout
router.post("/users/customers/checkout", customerAuth, async (req, res) => {
  const ordersByCustomer = [];
  const flag = 0;
  try {
    const orders = req.customer.cart;
    let totalAmount = 0;
    await orders.reduce(async (memo, order) => {
      await memo;
      const _id = order.item;
      const temp = await Item.findOne({ _id });
      const stock = temp.stock;
      const quantity = order.quantity;
      if (stock === 0 || stock - quantity < 0) {
        flag = 1;
        throw new Error();
      }
      temp.stock = stock - quantity;
      const price = temp.price;
      const seller = temp.seller;
      const itemid = temp._id;
      const retur = temp.returnValid;
      const item = {
        price,
        seller,
        itemid,
        status: "ordered",
        returnValid: retur,
        quantity,
      };
      totalAmount += price * quantity;
      await temp.save();
      ordersByCustomer.push(item);
    }, undefined);
    const datePlacedOn = new Date();
    const deliveryDetails = {
      name: req.body.firstName,
      address: req.body.address,
      town: req.body.town,
      state: req.body.state,
      pin: req.body.pin,
      phone: req.body.phoneNumber,
      email: req.body.email,
    };
    const order = new Order({
      items: ordersByCustomer,
      placedBy: req.customer._id,
      totalAmount,
      datePlacedOn,
      deliveryDetails,
    });
    // req.customer.cart = [];
    // await req.customer.save();
    await order.save();
    res.status(200).send(order);
  } catch (e) {
    for (let index = 0; index < ordersByCustomer.length; index++) {
      const order = ordersByCustomer[index];
      const _id = order.itemid;
      const quantity = order.quantity;
      const temp = await Item.findOne({ _id });
      const stock = temp.stock;
      temp.stock = stock + quantity;
      await temp.save();
    }
    console.log(e);
    res.status(500).send(e);
  }
});

//route for adding order_id in seller
router.post("/addOrder", async (req, res) => {
  const _id = req.body.orderId;
  try {
    const order = await Order.findOne({ _id });
    const items = order.items;
    const encId = [];
    for (let i = 0; i < items.length; i++) {
      const _id = items[i].seller;
      if (encId.includes(String(_id)) === false) {
        const seller = await Seller.findOne({ _id });
        const orderId = req.body.orderId;
        seller.orders = seller.orders.concat({ orderId });
        await seller.save();
        encId.push(String(_id));
      }
    }

    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

//restore order if error
router.post("/restoreOrder", async (req, res) => {
  const len = req.body.server_order.items.length;
  const items = req.body.server_order.items;
  try {
    for (let i = 0; i < len; i++) {
      const tempItem = await Item.findOne({ _id: items[i].itemid });
      tempItem.stock = tempItem.stock + items[i].quantity;
      await tempItem.save();
    }
    const _id = req.body.server_order._id;
    const order = await Order.findByIdAndDelete({ _id });
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});
//save payment id and orderId
router.post("/saveRazorpaydetails", async (req, res) => {
  const razorpayOrderId = req.body.rpOrderId;
  const razorpayPaymentId = req.body.rpPaymentId;
  const _id = req.body.orderId;
  try {
    const order = await Order.findOne({ _id });
    order.razorpayOrderId = razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
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
    const currentDate = new Date();
    const orderPlacedOn = order.datePlacedOn;
    const items = order.items;
    items.forEach((item) => {
      if (String(item._id) === itemid) {
        const returnValid = item.returnValid;
        //if orderplaceOn date + validity period is less than or equal to current date
        if (
          orderPlacedOn.getTime() + returnValid * 24 * 60 * 60 * 1000 <=
          currentDate.getTime()
        ) {
          throw new Error({ message: "Return period has expired" });
        }

        //send notification to seller to initiate return  TODO
      }
    });
    const message = "Return would be initiated by the seller";
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

//route to return all items of a particular orderid
//

module.exports = router;
