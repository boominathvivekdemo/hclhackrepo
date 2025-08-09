// Place order endpoint
app.post('/api/orders', (req, res) => {
  const { email, items } = req.body;
  if (!email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Email and items are required.' });
  }
  const usersPath = path.join(__dirname, '../data/users.json');
  fs.readFile(usersPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Failed to parse users data.' });
    }
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const order = { id: Date.now(), date: new Date().toISOString(), items };
    user.orders = user.orders || [];
    user.orders.push(order);
    fs.writeFile(usersPath, JSON.stringify(users, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save order.' });
      }
      res.status(201).json({ message: 'Order placed successfully.', order });
    });
  });
});

// Get user orders endpoint
app.get('/api/orders', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  const usersPath = path.join(__dirname, '../data/users.json');
  fs.readFile(usersPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Failed to parse users data.' });
    }
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user.orders || []);
  });
});

// Cancel order endpoint
app.delete('/api/orders/:orderId', (req, res) => {
  const { email } = req.body;
  const { orderId } = req.params;
  if (!email || !orderId) {
    return res.status(400).json({ error: 'Email and orderId are required.' });
  }
  const usersPath = path.join(__dirname, '../data/users.json');
  fs.readFile(usersPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Failed to parse users data.' });
    }
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    user.orders = (user.orders || []).filter(order => String(order.id) !== String(orderId));
    fs.writeFile(usersPath, JSON.stringify(users, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Failed to cancel order.' });
      }
      res.json({ message: 'Order cancelled successfully.' });
    });
  });
});
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoint to get all products
app.get('/api/products', (req, res) => {
  const dataPath = path.join(__dirname, '../data/products.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read products data.' });
    }
    try {
      const products = JSON.parse(data);
      res.json(products);
    } catch (parseErr) {
      res.status(500).json({ error: 'Failed to parse products data.' });
    }
  });
});


// Registration endpoint
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  const usersPath = path.join(__dirname, '../data/users.json');
  fs.readFile(usersPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data.' });
    }
    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Failed to parse users data.' });
    }
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    const newUser = { name, email, password, orders: [] };
    users.push(newUser);
    fs.writeFile(usersPath, JSON.stringify(users, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save user.' });
      }
      res.status(201).json({ message: 'User registered successfully.', user: { name, email, orders: [] } });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
