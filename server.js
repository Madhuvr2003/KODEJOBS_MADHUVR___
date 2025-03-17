const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// CORS configuration to allow frontend to access backend
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from React app
  credentials: true
}));

app.use(express.json()); // Middleware to parse JSON requests

const usersFilePath = path.join(__dirname, 'src/components/users.json');

// Ensure users.json file exists
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }, null, 2));
}

// ✅ Signup endpoint (Register new user)
app.post('/api/signup', (req, res) => {
  try {
    const { fullName, email, password, dateOfBirth } = req.body;

    // Read users from file
    const fileData = fs.readFileSync(usersFilePath, 'utf8');
    const data = JSON.parse(fileData);

    // Check if email already exists
    if (data.users.some(user => user.email === email)) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Calculate user age
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    // Create new user object
    const newUser = {
      id: Date.now(),
      fullName,
      email,
      password, // ⚠️ Consider hashing password in real-world apps!
      dateOfBirth,
      age,
      createdAt: new Date().toISOString(),
      applications: []
    };

    // Add new user to the database (JSON file)
    data.users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));

    console.log('✅ New user registered:', newUser);
    
    res.status(201).json({ success: true, message: 'Signup successful', user: newUser });
  } catch (error) {
    console.error('❌ Server error during signup:', error);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
});

// ✅ Login endpoint (Authenticate user)
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for:', email);

    // Read users from file
    const fileData = fs.readFileSync(usersFilePath, 'utf8');
    const data = JSON.parse(fileData);

    // Find user with matching email and password
    const user = data.users.find(u => u.email === email && u.password === password);

    if (user) {
      console.log('✅ Login successful for:', email);
      const { password, ...userWithoutPassword } = user;
      res.json({
        success: true,
        user: userWithoutPassword,
        message: 'Login successful'
      });
    } else {
      console.log('❌ Login failed for:', email);
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('❌ Server error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
