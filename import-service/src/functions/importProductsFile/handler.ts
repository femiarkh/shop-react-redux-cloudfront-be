import 'source-map-support/register';

import { S3 } from 'aws-sdk';
import { middyfy } from '../../libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

const BUCKET = 'rss-femiarkh-import-service';
let status = 200;

export const importProductsFile = async (event: APIGatewayProxyEvent) => {
  console.log(`[${new Date().toLocaleString()}]`);
  console.log('[REQUEST]: import products file');
  console.log(
    `[Request parameters]: ${JSON.stringify(event.queryStringParameters)}`
  );
  const s3 = new S3({ region: 'eu-west-1' });
  console.log('process.env.SQS_URL', process.env.SQS_URL);
  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${event.queryStringParameters.name}`,
    Expires: 60,
    ContentType: 'text/csv',
  };

  let url: string;

  try {
    url = await s3.getSignedUrlPromise('putObject', params);
  } catch (error) {
    console.error(error);
    status = 500;
  }

  return {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ url }),
  };
};

export const main = middyfy(importProductsFile);
