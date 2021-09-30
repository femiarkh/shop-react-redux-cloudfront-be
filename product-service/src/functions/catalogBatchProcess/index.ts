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
      sqs: {
        batchSize: 5,
        maximumBatchingWindow: 10,
        arn: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
      },
    },
  ],
};
