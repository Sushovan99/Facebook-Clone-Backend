const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { validateEmail } = require('../utils/validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'first name is required'],
      minLength: [2, 'first name must be at least 2 characters'],
      maxLength: [30, 'last name most be at least 30 characters'],
      trim: true,
      text: true,
    },
    lastName: {
      type: String,
      required: [true, 'last name is required'],
      minLength: [2, 'first name must be at least 2 characters'],
      maxLength: [30, 'last name most be at least 30 characters'],
      trim: true,
      text: true,
    },
    username: {
      type: String,
      required: [true, 'username is required'],
      trim: true,
      text: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'first name is required'],
      trim: true,
      unique: true,
      validate: {
        validator: function (email) {
          return validateEmail(email);
        },
        message: 'Invalid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'first name is required'],
      minLength: [8, 'Password must be at least 8 characters'],
      maxLength: [30, 'Pssowrd must be at most 30 characters'],
    },
    picture: {
      type: String,
      trim: true,
      default: 'https://avatarfiles.alphacoders.com/322/322260.jpg',
    },
    cover: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'gender is required'],
      trim: true,
    },
    bYear: {
      type: Number,
      required: true,
      trim: [true, 'birth year is required'],
    },
    bMonth: {
      type: Number,
      required: true,
      trim: [true, 'birth month is required'],
    },
    bDay: {
      type: Number,
      required: true,
      trim: [true, 'birth day is required'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    requests: {
      type: Array,
      default: [],
    },
    search: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
      },
    ],
    details: {
      bio: {
        type: String,
      },
      otherName: {
        type: String,
      },
      job: {
        type: String,
      },
      workplace: {
        type: String,
      },
      highSchool: {
        type: String,
      },
      college: {
        type: String,
      },
      currentCity: {
        type: String,
      },
      homeTown: {
        type: String,
      },
      relationship: {
        type: String,
        enum: ['Single', 'In a relationship', 'Married', 'Divorced'],
      },
      instagram: {
        type: String,
      },
      savedPosts: [
        {
          post: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
          },
          savedAt: {
            type: Date,
            default: new Date(),
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordValid = async function (
  userPassword,
  savedPassword
) {
  // Paramters Order is important
  return await bcrypt.compare(userPassword, savedPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
