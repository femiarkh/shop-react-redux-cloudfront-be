import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import { Handler } from 'aws-lambda';

const basicAuthorizer: Handler = async (event, _ctx, cb) => {
  const authorizationHeader = event.headers.Authorization;

  if (!authorizationHeader) {
    return cb('Unauthorized');
  }

  try {
    const encodedCreds = authorizationHeader.split(' ')[1];
    const [username, password] = Buffer.from(encodedCreds, 'base64')
      .toString()
      .split(':');

    console.log(`username: ${username}, password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    cb(null, policy);
  } catch (e) {
    cb(`Unauthorized: ${e.message}`);
  }
};

const generatePolicy = (
  principalId: string,
  resource: string,
  effect: 'Deny' | 'Allow' = 'Allow'
) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

export const main = middyfy(basicAuthorizer);
