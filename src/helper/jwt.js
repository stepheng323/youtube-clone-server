import Jwt from 'jsonwebtoken';

export const signToken = async (data) => {
  const token = await Jwt.sign(data, process.env.TOKEN_SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
  const { exp: tokenExpiry } = Jwt.decode(token);
  return { token, tokenExpiry };
};

export const signRefreshToken = async (data) => {
  const refreshToken = await Jwt.sign(data, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
  return refreshToken;
};

export const verifyToken = (token) => Jwt.verify(token, process.env.TOKEN_SECRET_KEY);

export const verifyRefreshToken = (refreshToken) => {
  const refToken = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
  return refToken;
};
