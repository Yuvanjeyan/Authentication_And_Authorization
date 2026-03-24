const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username required'],
    unique: true,
    trim: true,
    minlength: [3, 'Min 3 chars'],
    maxlength: [30, 'Max 30 chars'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Valid email required'],
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: [6, 'Min 6 chars'],
    select: false,
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);