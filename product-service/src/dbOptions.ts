const {
  PG_HOST: host,
  PG_PORT: port,
  PG_DATABASE: database,
  PG_USERNAME: user,
  PG_PASSWORD: password,
} = process.env;

export const dbOptions = {
  host,
  port: +port,
  database,
  user,
  password,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
};
