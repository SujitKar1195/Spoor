const express = require('express');
const User = require('../db/userModel');
const router = express.Router();

router.get('/login', (req, res) => {
  return res.render('login');
});
router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email: email});
  if (!user) return res.render('signup');
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie('token', token).redirect('/');
  } catch (error) {
    return res.render('login', {
      error: 'Incorrect email or password',
    });
  }
});

router.post('/signup', async (req, res) => {
  const {name, email, password} = req.body;
  const user = await User.findOne({email: email});
  if (user) return res.render('login');
  await User.create({
    name,
    email,
    password,
  });

  return res.redirect('login');
});

router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/user/login');
});
module.exports = router;
