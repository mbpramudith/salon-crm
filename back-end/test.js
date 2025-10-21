const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory users data
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// Routes

// ✅ Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// ✅ Get single user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// ✅ Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// ✅ Update user by ID
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, email } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;

  res.json(user);
});

// ✅ Delete user by ID
app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
