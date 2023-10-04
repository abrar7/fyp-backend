const express = require("express");
const stripe = require("stripe")("sk_test_i2VMzET9eV0X14HwvkBzFYdR");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/home", (req, res) => {
  res.send("Hellow test");
});

app.get("/home/testing", (req, res) => {
  res.send("Testing purposes only");
});
app.get("/home/testing/projects", (req, res) => {
  res.send("Checking project APIS");
});

app.post("/", async (req, res) => {
  try {
    const { amount } = req.body;

    // Creating payment intent with the provided amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

exports.module = {
  app: app,
};
