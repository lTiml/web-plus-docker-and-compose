require('dotenv').config()
export const config = () => ({
  port: Number(process.env.PORT),
  jwtSecret: '1a1a1a',
});
