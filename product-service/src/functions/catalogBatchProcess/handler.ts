import 'source-map-support/register';
import { StatusCodes } from 'http-status-codes';
import { Client } from 'pg';
import { SNS } from 'aws-sdk';
import { middyfy } from '../../libs/lambda';
import { validateProduct } from '../../libs/validateProduct';
import {
  formatJSONErrorResponse,
  formatJSONResponse,
} from '../../libs/apiGateway';
import { dbOptions } from '../../dbOptions';

export const catalogBatchProcess = async (event) => {
  const client = new Client(dbOptions);
  const sns = new SNS({ region: 'eu-west-1' });
  await client.connect();
  await client.query('BEGIN');

  try {
    await Promise.all(
      event.Records.map(async ({ body }) => {
        console.log(`[${new Date().toLocaleString()}]`);
        console.log('[ADD A PRODUCT]');
        console.log(`[Product data]: ${body}`);
        const product = JSON.parse(body);

        const validationErrors = validateProduct(product);
        if (validationErrors.length) {
          throw new Error(JSON.stringify(validationErrors));
        }

        const { title, description, price, count, image } = product;

        await client.query(`
            insert into products (title, description, price, image) values
              ('${title}', '${description}', ${+price}, '${image}')
          `);

        const { rows: addedProduct } = await client.query(`
          select
            id
          from products
          where title = '${title}'
          `);
        const id = addedProduct[0].id;

        await client.query(`
            insert into stocks (product_id, count) values
              ('${id}', '${+count}')
          `);

        const message = JSON.stringify({
          title,
          description,
          price: +price,
          count: +count,
          image,
        });
        await sns
          .publish({
            Subject: 'New bike was added to the db!',
            Message: message,
            TopicArn: process.env.SNS_ARN,
            MessageAttributes: {
              price: {
                DataType: 'Number',
                StringValue: price,
              },
            },
          })
          .promise();
        console.log('Email was sent');
      })
    );
  } catch (err) {
    console.log(err);
    client.query('ROLLBACK');
    return formatJSONErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      err.message
    );
  }

  await client.query('COMMIT');
  client.end();

  return formatJSONResponse({
    message: 'Products added.',
  });
};

export const main = middyfy(catalogBatchProcess);
