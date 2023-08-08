const User = require('../models/User');
const { hashPassword, comparePasswords } = require('../utils/bcryptHelper');
const { generateToken } = require('../utils/jwtHelper');

const register = async (req, res) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.match(emailRegex)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ newUser, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = generateToken({ token: user._id });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed' });
  }
};

module.exports = {
  register,
  login,
};
