const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secretKey = crypto.randomBytes(32).toString('hex');
const session = require('express-session');
const tokenExpiration = '1h';

const sessionMiddleware = session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000,
    sameSite: 'lax',
  },
});

function generateToken(userId, requestSession) {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: tokenExpiration });

  if (requestSession) {
    requestSession.token = token;
    requestSession.save();
  }

  return token;
}

function authenticateToken(request, response, next) {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    response.sendStatus(401);
    return;
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      response.sendStatus(403);
      return;
    }

    request.userId = decoded.userId;
    next();
  });
}

module.exports = {
  authenticateToken,
  sessionMiddleware,
  generateToken,
};
