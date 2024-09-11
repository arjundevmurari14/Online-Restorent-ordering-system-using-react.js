const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require("./DB/Connection");
const uri ="mongodb+srv://arjundevmurari:cVBlxm9AccfL1ctk@cluster0.osrfphh.mongodb.net/customer?retryWrites=true&w=majority";
const orderSchema = require('./model/Product_Model');
const signupSchema = require('./model/signup_model');
const cors = require('cors');
connectDB(uri);
// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

// POST route to handle order submission
app.post('/order', (req, res) => {
  orderSchema.create(req.body)
  res.json({ success: true, message: 'Order placed successfully' });
});

app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await signupSchema.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new signupSchema({
      username,
      email,
      password, 
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

