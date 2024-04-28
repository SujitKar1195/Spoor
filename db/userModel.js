const {createHmac, randomBytes} = require('node:crypto');

const {Schema, model} = require('mongoose');
const {createTokenForUser} = require('../services/authentication');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: '../public/images/default.webp',
    },
  },
  {timestamps: true}
);

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static(
  'matchPasswordAndGenerateToken',
  async function (email, password) {
    const user = await this.findOne({email: email});
    if (!user) throw Error('Invalid email');
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHashedPassword = createHmac('sha256', salt)
      .update(password)
      .digest('hex');

    if (hashedPassword !== userProvidedHashedPassword) {
      throw Error('invalid password');
    }

    const token = createTokenForUser(user);
    return token;
  }
);

const User = model('users', userSchema);
module.exports = User;
