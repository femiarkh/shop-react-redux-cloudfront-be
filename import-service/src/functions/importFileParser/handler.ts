import 'source-map-support/register';

import { S3, SQS } from 'aws-sdk';
import * as csv from 'csv-parser';
import { middyfy } from '@libs/lambda';

const BUCKET = 'rss-femiarkh-import-service';

const importFileParser = async (event) => {
  const s3 = new S3({ region: 'eu-west-1' });
  const sqs = new SQS();

  for (const record of event.Records) {
    const key = record.s3.object.key;
    const params = {
      Bucket: BUCKET,
      Key: key,
    };
    const s3Stream = s3.getObject(params).createReadStream();
    s3Stream.pipe(csv()).on('data', (data) => {
      sqs.sendMessage(
        {
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(data),
        },
        (err, data) => {
          if (err) {
            console.log('Error', err);
          } else {
            console.log('Success', data.MessageId);
          }
        }
      );
    });
    s3Stream.on('error', (error) => {
      console.log(error);
    });
    s3Stream.on('end', async () => {
      console.log(`Copy from ${BUCKET}/${key}`);
      const destinationKey = key.replace('uploaded', 'parsed');
      try {
        await s3
          .copyObject({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${key}`,
            Key: destinationKey,
          })
          .promise();
        await s3
          .deleteObject({
            Bucket: BUCKET,
            Key: key,
          })
          .promise();
        console.log(`Copied into ${BUCKET}/${destinationKey}`);
      } catch {
        console.log('Copying failed.');
      }
    });
  }

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ message: 'OK' }),
  };
};

export const main = middyfy(importFileParser);
