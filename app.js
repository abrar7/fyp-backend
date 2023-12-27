const express = require("express");
const stripe = require("stripe")("sk_test_i2VMzET9eV0X14HwvkBzFYdR");
const mongoose = require("mongoose");
const purchasedItems = require("./models/purchasedItems");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/home", (req, res) => {
  res.send("Hellow test");
});

app.post("/payments/intents", async (req, res) => {
  try {
    const { amount } = req.body;

    // payment intent created with the provided amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "PKR",
    });

    // Return the client secret to complete the payment on the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

async function insertData(data) {
  const itemsData = data?.items?.map((item) => ({
    companyName: item?.companyName,
    count: item?.count,
    id: item?.id,
    imgLink: item?.imgLink,
    inStock: item?.inStock,
    itemName: item?.itemName,
    price: item?.price,
    weight: item?.weight,
  }));

  await purchasedItems.create({
    userUid: data?.userUid,
    date: data?.date,
    items: itemsData,
  });
}

app.post("/insertPurchases", async (req, res) => {
  try {
    const { data } = req.body;
    insertData(data);
    res.status(200).json({ messgae: "Purchase successfull." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

mongoose.connect(
  "mongodb+srv://abrarmughal003:abrar12345@purchases.f4ifnu8.mongodb.net/?retryWrites=true&w=majority"
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

exports.module = {
  app: app,
};
