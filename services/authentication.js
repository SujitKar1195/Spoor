const JWT = require('jsonwebtoken');

const secretKey = 'dmaster39coder@119~2498!@#873458';

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };

  const token = JWT.sign(payload, secretKey);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secretKey);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
