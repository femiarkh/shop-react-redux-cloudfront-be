import { handlerPath } from '@libs/handlerResolver';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    PG_HOST,
    PG_PORT,
    PG_DATABASE,
    PG_USERNAME,
    PG_PASSWORD,
  },
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
      },
    },
  ],
};
