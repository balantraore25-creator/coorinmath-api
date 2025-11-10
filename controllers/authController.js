const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LOGIN
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'All fields are required' });

  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser || !foundUser.active) return res.status(401).json({ message: 'Unauthorized' });

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: 'Unauthorized' });

  // 🔑 Vérifie si une session existe déjà
  if (foundUser.refreshToken) {
    return res.status(403).json({ message: 'Session déjà active. Déconnectez-vous d’abord.' });
  }

  const accessToken = jwt.sign(
    { UserInfo: { username: foundUser.username, roles: foundUser.roles } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  // Stocke le refreshToken en base
  foundUser.refreshToken = refreshToken;
  await foundUser.save();

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken });
};

// REFRESH
const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });

    const foundUser = await User.findOne({ username: decoded.username }).exec();
    if (!foundUser || foundUser.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = jwt.sign(
      { UserInfo: { username: foundUser.username, roles: foundUser.roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  });
};

// LOGOUT
const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (foundUser) {
    foundUser.refreshToken = null; // 🔑 libère la session
    await foundUser.save();
  }

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Déconnecté' });
};

module.exports = { login, refresh, logout };
