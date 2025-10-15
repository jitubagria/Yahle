export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
export const NODE_ENV = process.env.NODE_ENV ?? 'development';

const ENV = {
  JWT_SECRET,
  NODE_ENV,
};

export default ENV;
