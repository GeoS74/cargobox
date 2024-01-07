export default {
  server: {
    host: process.env.SERVER_HOST || 'localhost',
    port: process.env.SERVER_PORT || 3232,
  },
  postgres: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cargobox',
    password: process.env.DB_PASS || 'admin',
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  },
};
