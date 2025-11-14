export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: process.env.DB_SSL_MODE === 'require',
  },
  swagger: {
    title: process.env.SWAGGER_TITLE || 'Boilerplate Service API',
    description: process.env.SWAGGER_DESCRIPTION || 'API documentation for Boilerplate service',
    version: process.env.SWAGGER_VERSION || '1.0',
  },
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
    webhookSecret: process.env.CLERK_WEBHOOK_SECRET,
  },
});
