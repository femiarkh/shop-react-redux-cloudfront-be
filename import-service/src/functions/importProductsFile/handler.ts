import 'source-map-support/register';

import { S3 } from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

const BUCKET = 'rss-femiarkh-import-service';
let links = [];
let status = 200;

const importProductsFile = async (event: APIGatewayProxyEvent) => {
  console.log(event.queryStringParameters);
  const s3 = new S3({ region: 'eu-west-1' });
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
