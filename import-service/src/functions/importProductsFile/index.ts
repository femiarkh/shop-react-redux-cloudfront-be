import { handlerPath } from '@libs/handlerResolver';

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
          arn: '${self:custom.authorizerArn}',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'request',
        },
      },
    },
  ],
};
