const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// File to save user data
const USER_DATA_FILE = path.join(__dirname, 'user_data.json');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));//public files or images ko use karne ke liye hota hai


// Serve the registration form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, email, password, date, message } = req.body;

    // Validate all required fields
    if (!name || !email || !password || !date || !message) {
        return res.status(400).json({ message: 'All fields are required!' });//client side error
    }

    // Load existing user data
    let users = [];
    if (fs.existsSync(USER_DATA_FILE)) {
        const data = fs.readFileSync(USER_DATA_FILE);
        users = JSON.parse(data);
    }//previuos user check

    // Check for existing email to prevent duplicates
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        return res.status(400).json({ message: 'Email is already registered!' });
    }

    // Add new user
    users.push({ name, email, password, date, message });

    // Save to file
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(users, null, 4));

    res.json({ message: 'User data saved successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
