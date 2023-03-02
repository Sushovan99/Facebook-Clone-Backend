const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const { sendVerficationEmail } = require('../utils/mail');
const { generateToken, verifyToken } = require('../utils/token');
const AppError = require('../utils/appError');

exports.signup = catchAsyncError(async (req, res, next) => {
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    gender: req.body.gender,
    bYear: req.body.bYear,
    bMonth: req.body.bMonth,
    bDay: req.body.bDay,
  });

  const emailToken = await generateToken(user._id, '10m');

  const url = `${process.env.BASE_URL}/activate/${emailToken}`;

  await sendVerficationEmail(user.email, user.firstName, url);

  const token = await generateToken(user._id, '7d');

  res.status(201).json({
    status: 'success',
    token,
    message: 'Signup successful! Please verify your email to start.',
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      picture: user.picture,
      verified: user.verified,
    },
  });
});

exports.verifyEmail = catchAsyncError(async (req, res, next) => {
  const { token } = req.body;

  const { id } = await verifyToken(token);

  const user = await User.findById(id);

  if (user.verified === true) {
    return next(new AppError(400, 'Email already verified'));
  }
  await User.findByIdAndUpdate(id, { verified: true });

  res.status(200).json({
    message: 'Your email has been verified & your account is activated.',
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return next(
      new AppError(
        404,
        'The email address you entered is not connected to an account.'
      )
    );
  }

  const isPasswordValid = await user.isPasswordValid(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError(401, 'Invalid credentials. Please try again.'));
  }

  const token = await generateToken(user._id, '7d');

  res.status(200).json({
    status: 'success',
    token,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      picture: user.picture,
      verified: user.verified,
      message: 'Signup successful! Please verify your email to start.',
    },
  });
});
