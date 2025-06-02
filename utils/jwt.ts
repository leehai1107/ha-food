import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  accountId: number;
  email: string;
  roleId: number;
  roleName: string;
}

export const generateToken = (account: any): string => {
  const payload: JwtPayload = {
    accountId: account.id,
    email: account.email,
    roleId: account.roleId,
    roleName: account.role?.name || 'user'
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'ha-food-api',
    audience: 'ha-food-client'
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'ha-food-api',
      audience: 'ha-food-client'
    }) as JwtPayload;

    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const generateRefreshToken = (account: any): string => {
  const payload = {
    accountId: account.id,
    email: account.email,
    type: 'refresh'
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'ha-food-api',
    audience: 'ha-food-client'
  } as jwt.SignOptions);
};
