const jwt = require("jsonwebtoken");

const generateToken = (payload, secret, expiresIn) => {
  try {
    return jwt.sign(payload, secret, { expiresIn });
  } catch (error) {
    throw new Error("Error generating JWT token");
  }
};

const generateAuthToken = async (user) => {
  const secret = process.env.JWT_TOKEN_SECRET;
  const payload = { id: user._id, role: user.role };
  const expiresIn = process.env.JWT_TOKEN_EXPIRES_IN;

  let token = generateToken(payload, secret, expiresIn);
  return { token };
};

const createSendToken = async (user, res) => {
  const { token } = await generateAuthToken(user);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: 'None' 
  };

  res.cookie("jwt", token, cookieOptions);
  res.success({data: {user , token} })
};

module.exports = {
  createSendToken,
  generateAuthToken,
};
