const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Customer Schema
const customerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  checkingBalance: {
    type: Number,
    default: 0,
  },
  savingsBalance: {
    type: Number,
    default: 0,
  },
  transactions: {
    type: [String],
    default: [],
  },
});

const Customer = mongoose.model("Customer", customerSchema);

// Home
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Rest API Bank",
  });
});

// Health
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    service: "bank-api",
  });
});

// Get All Customers
app.get("/api/v1/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Get Customer By Username
app.get("/api/v1/customers/:username", async (req, res) => {
  try {
    const customer = await Customer.findOne({
      username: req.params.username.toLowerCase(),
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Create Customer
app.post("/api/v1/customers", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const exists = await Customer.findOne({
      username: username.toLowerCase(),
    });

    if (exists) {
      return res.status(400).json({
        message: "Customer already exists",
      });
    }

    const customer = new Customer({
      username: username.toLowerCase(),
      password,
      checkingBalance: 0,
      savingsBalance: 0,
      transactions: [],
    });

    await customer.save();

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Update Customer
app.put("/api/v1/customers/:username", async (req, res) => {
  try {
    const customer = await Customer.findOne({
      username: req.params.username.toLowerCase(),
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    if (req.body.password) customer.password = req.body.password;

    if (req.body.checkingBalance !== undefined)
      customer.checkingBalance = req.body.checkingBalance;

    if (req.body.savingsBalance !== undefined)
      customer.savingsBalance = req.body.savingsBalance;

    await customer.save();

    res.json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Deposit Money
app.post("/api/v1/customers/:username/deposit", async (req, res) => {
  try {
    const { amount, account } = req.body;

    const customer = await Customer.findOne({
      username: req.params.username.toLowerCase(),
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    if (account === "checking") {
      customer.checkingBalance += amount;
    } else if (account === "savings") {
      customer.savingsBalance += amount;
    } else {
      return res.status(400).json({
        message: "Account must be checking or savings",
      });
    }

    customer.transactions.push(`Deposited $${amount}`);

    await customer.save();

    res.json({
      message: "Deposit successful",
      customer,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Delete Customer
app.delete("/api/v1/customers/:username", async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      username: req.params.username.toLowerCase(),
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({
      message: "Customer deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Bank API running at http://localhost:${port}`);
});
