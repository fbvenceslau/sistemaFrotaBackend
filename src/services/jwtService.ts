import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is required")
}

export const jwtService = {
  signToken: (payload: string | object | Buffer, expiration: jwt.SignOptions["expiresIn"]) => {
    return jwt.sign(payload, secret, {
      expiresIn: expiration
    });
  },

  verifyToken: (token: string, callbackfn: jwt.VerifyCallback) => {
    jwt.verify(token, secret, callbackfn);
  }
}