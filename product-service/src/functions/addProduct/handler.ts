import 'source-map-support/register';
import { Client } from 'pg';

import {
  formatJSONErrorResponse,
  formatJSONResponse,
} from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { dbOptions } from '../../dbOptions';
import { StatusCodes } from 'http-status-codes';
import { validateProduct } from './validate';

export const addProduct = async (event) => {
  const client = new Client(dbOptions);
  const validationErrors = validateProduct(event.body);
  if (validationErrors.length) {
    return formatJSONErrorResponse(
      StatusCodes.BAD_REQUEST,
      JSON.stringify(validationErrors)
    );
  }
  const { title, description, price, count, image } = event.body;
  console.log(title, description, price, count, image);
  try {
    await client.connect();

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

    return formatJSONResponse({
      message: 'Product added.',
    });
  } catch (error) {
    return formatJSONErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went terribly wrong.'
    );
  } finally {
    client.end();
  }
};

export const main = middyfy(addProduct);
