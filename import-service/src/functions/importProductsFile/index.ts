import { handlerPath } from '@libs/handlerResolver';
import * as dotenv from 'dotenv';
dotenv.config();

const { BASIC_AUTHORIZER_ARN } = process.env;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: BASIC_AUTHORIZER_ARN,
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'request',
        },
      },
    },
  ],
};
