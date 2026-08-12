const User = require('../models/User');

// Create a new user (Admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'A user with this email already exists'
      });
    }

    // Pass password directly to User.create - the pre-save hook in User model handles hashing automatically
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      message: 'Failed to create user'
    });
  }
};

// List all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Failed to fetch users'
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Safeguard: Prevent logged-in admin from changing their own role
    if (req.user.id.toString() === userId.toString() && role && role !== user.role) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (password) user.password = password; // pre-save hook hashes this automatically on save

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Safeguard: Prevent admin from deleting themselves
    if (req.user.id.toString() === userId.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser
};
