const express = require("express");
const stripe = require("stripe")("sk_test_i2VMzET9eV0X14HwvkBzFYdR");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hellow test");
});

app.post("/payments/intents", async (req, res) => {
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
