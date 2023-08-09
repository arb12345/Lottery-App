const User = require('../models/User');

const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.token;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

module.exports = {
  getUserHistory,
};