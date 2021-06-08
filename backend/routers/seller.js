const express = require("express");
const router = new express.Router();
const Seller = require("../models/seller");
const sellerAuth = require("../middlewares/sellerAuth");
const Item = require("../models/items");
const multer = require("multer");
const sharp = require("sharp");
const Order = require("../models/order");

//route for seller signup
router.post("/users/seller", async (req, res) => {
  const seller = new Seller(req.body);

  try {
    await seller.save();
    const token = await seller.generateAuthToken();
    res.cookie("token", token, { httpOnly: true });
    res.status(201).send({ seller, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//route for seller login
router.post("/users/seller/login", async (req, res) => {
  try {
    const seller = await Seller.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await seller.generateAuthToken();
    res.cookie("token", token, { httpOnly: true });
    res.send({ seller, token });
  } catch (e) {
    res.status(400).send();
  }
});

//route for seller logout
router.post("/users/seller/logout", sellerAuth, async (req, res) => {
  try {
    req.seller.tokens = req.seller.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.seller.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//route for jwt decode
router.post("/users/seller/decode", sellerAuth, async (req, res) => {
  try {
    let sent = false;
    req.seller.tokens.forEach((token) => {
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

//route for seller adding items
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Please upload a jpg,jpeg or a png file format only!")
      );
    }
    cb(undefined, true);
  },
});
router.post("/items", sellerAuth, upload.single("image"), async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({
      width: 300,
      height: 300,
    })
    .png()
    .toBuffer();
  const item = new Item({
    ...req.body,
    seller: req.seller._id,
    image: buffer,
  });

  try {
    await item.save();
    res.status(201).send({ item });
  } catch (e) {
    res.status(400).send(e);
  }
});

//route for fetching all items by seller

router.get("/seller/items", sellerAuth, async (req, res) => {
  try {
    await req.seller
      .populate({
        path: "items",
      })
      .execPopulate();
    res.send(req.seller.items);
  } catch (e) {
    res.status(500).send();
  }
});

//route for getting item by id
router.get("/seller/items/:id", sellerAuth, async (req, res) => {
  const _id = req.params.id;
  try {
    const item = await Item.findOne({ _id });
    if (!item) {
      return res.status(404).send();
    }
    res.status(200).send(item);
  } catch (e) {
    res.status(500).send();
  }
});

//route for updating items by seller
router.patch("/update/item/:id", sellerAuth, async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = [
    "itemname",
    "description",
    "category",
    "stock",
    "price",
    "show",
    "image",
    "returnValid",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const _id = req.params.id;
    const item = await Item.findOne({ _id });

    if (!item) {
      return res.status(404).send();
    }

    updates.forEach((update) => (item[update] = req.body[update]));
    await item.save();
    res.send(item);
  } catch (e) {
    res.status(400).send(e);
  }
});
//route for deleting items

router.delete("/item/delete/:id", sellerAuth, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id });
    if (!item) {
      return res.status(404).send();
    }
    res.send(item);
  } catch (e) {
    res.status(500).send();
  }
});

//route for fetching all orders of the seller
router.post("/getOrders", sellerAuth, async (req, res) => {
  const orders = req.seller.orders;
  const pageNumber = req.body.pageNumber;
  const numberOfElements = 6;
  let orderSeller = {};
  let maxIndex = pageNumber * numberOfElements - 1;
  let startIndex = maxIndex - 5;
  if (orders.length < startIndex) {
    return res.status(200).send(false);
  }
  if (orders.length < maxIndex) {
    maxIndex = orders.length - 1;
  }
  while (startIndex <= maxIndex) {
    const _id = orders[startIndex].orderId;
    const order = await Order.findOne({ _id });
    order.items.map((item) => {
      if (String(item.seller) === String(req.seller._id)) {
        const key = _id;
        if (orderSeller[key]) {
          orderSeller[key].push(item);
        } else {
          orderSeller[key] = [item];
        }
      }
    });
    startIndex++;
  }
  res.status(201).send(orderSeller);
});

//route for getting image of items
router.get("/item/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || !item.image) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(item.image);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
