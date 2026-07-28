const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let customers = {
  emma: {
    username: "emma",
    password: "emma123",
    checkingBalance: 850,
    savingsBalance: 2500,
    transactions: ["Deposited $1000", "Paid Electricity Bill $150"],
  },

  james: {
    username: "james",
    password: "james123",
    checkingBalance: 420,
    savingsBalance: 1800,
    transactions: ["Transferred $200", "Deposited $500"],
  },

  olivia: {
    username: "olivia",
    password: "olivia123",
    checkingBalance: 1300,
    savingsBalance: 4100,
    transactions: ["ATM Withdrawal $100", "Salary Deposit $2500"],
  },

  liam: {
    username: "liam",
    password: "liam123",
    checkingBalance: 275,
    savingsBalance: 950,
    transactions: ["Online Purchase $80", "Deposited $300"],
  },

  sophia: {
    username: "sophia",
    password: "sophia123",
    checkingBalance: 620,
    savingsBalance: 3200,
    transactions: ["Transferred $150", "Deposited $700"],
  },
};

// Home
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Rest API Bank",
  });
});

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    service: "bank-api",
  });
});

// Get All Customers
app.get("/api/v1/customers", (req, res) => {
  res.json(Object.values(customers));
});

// Get Customer By Username
app.get("/api/v1/customers/:username", (req, res) => {
  const username = req.params.username.toLowerCase();

  if (!customers[username]) {
    return res.status(404).json({
      message: "Customer not found",
    });
  }

  res.json(customers[username]);
});

// Create Customer
app.post("/api/v1/customers", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (customers[username.toLowerCase()]) {
    return res.status(400).json({
      message: "Customer already exists",
    });
  }

  customers[username.toLowerCase()] = {
    username,
    password,
    checkingBalance: 0,
    savingsBalance: 0,
    transactions: [],
  };

  res.status(201).json({
    message: "Customer created successfully",
    customer: customers[username.toLowerCase()],
  });
});

// Update Customer
app.put("/api/v1/customers/:username", (req, res) => {
  const username = req.params.username.toLowerCase();

  if (!customers[username]) {
    return res.status(404).json({
      message: "Customer not found",
    });
  }

  const customer = customers[username];

  customer.password = req.body.password || customer.password;
  customer.checkingBalance =
    req.body.checkingBalance ?? customer.checkingBalance;
  customer.savingsBalance = req.body.savingsBalance ?? customer.savingsBalance;

  res.json({
    message: "Customer updated successfully",
    customer,
  });
});

// Deposit Money
app.post("/api/v1/customers/:username/deposit", (req, res) => {
  const username = req.params.username.toLowerCase();
  const { amount, account } = req.body;

  if (!customers[username]) {
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
    customers[username].checkingBalance += amount;
  } else if (account === "savings") {
    customers[username].savingsBalance += amount;
  } else {
    return res.status(400).json({
      message: "Account must be checking or savings",
    });
  }

  customers[username].transactions.push(`Deposited $${amount}`);

  res.json({
    message: "Deposit successful",
    customer: customers[username],
  });
});

// Delete Customer
app.delete("/api/v1/customers/:username", (req, res) => {
  const username = req.params.username.toLowerCase();

  if (!customers[username]) {
    return res.status(404).json({
      message: "Customer not found",
    });
  }

  delete customers[username];

  res.json({
    message: "Customer deleted successfully",
  });
});

app.listen(port, () => {
  console.log(`Bank API running at http://localhost:${port}`);
});
