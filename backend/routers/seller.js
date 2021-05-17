const express = require("express");
const router = new express.Router();
const Seller = require("../models/seller");
const sellerAuth = require("../middlewares/sellerAuth");
const Item = require("../models/items");

//route for seller signup
router.post("/users/seller", async (req, res) => {
  const seller = new Seller(req.body);

  try {
    await seller.save();
    const token = await seller.generateAuthToken();
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

//route for seller adding items
router.post("/items", sellerAuth, async (req, res) => {
  const item = new Item({
    ...req.body,
    seller: req.seller._id,
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

//route for updating items by seller
router.patch("/update/item/:id", sellerAuth, async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = [
    "itemsname",
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

//route for uploading the image of the item


module.exports = router;
