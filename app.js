const express = require("express");
const stripe = require("stripe")("sk_test_i2VMzET9eV0X14HwvkBzFYdR");
const mongoose = require("mongoose");
const purchasedItems = require("./models/purchasedItems");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const port = 3000;
// ==============================

const dbUrl =
  "mongodb+srv://abrarmughal003:abrar12345@purchases.f4ifnu8.mongodb.net/purchases?retryWrites=true&w=majority";

// ===============================

app.get("/home", (req, res) => {
  res.send("Hellow test");
});

app.get("/purchaseHistory/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await purchasedItems.find({ userUid: id });
    res.status(200).json({ data: data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error occurred while saving data, Try Again!" });
  }
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
  try {
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

    const response = await purchasedItems.create({
      userUid: data?.userUid,
      grandTotal: data?.grandTotal,
      subTotal: data?.subTotal,
      gstAmount: data?.gstAmount,
      reward: data?.reward,
      date: data?.date,
      items: itemsData,
    });

    console.log("Purchase data inserted successfully.");
    return response;
  } catch (error) {
    console.error("Error inserting purchase data:", error);
    throw error;
  }
}

app.post("/insertPurchases", async (req, res) => {
  try {
    const { data } = req.body;
    const reponse = await insertData(data);
    res
      .status(200)
      .json({ message: "Purchase Successfull.", reponseId: reponse?._id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("MongoDb Connection successfull");
  })
  .catch((err) => {
    console.error("Error occured while creating connection to mongoDB!", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

exports.module = {
  app: app,
};
