export const config = () => ({
  port: Number(process.env.PORT),
  jwtSecret: process.env.jwtSecret,
});
