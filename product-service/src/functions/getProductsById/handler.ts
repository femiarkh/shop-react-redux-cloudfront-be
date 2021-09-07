import 'source-map-support/register';
import { Client } from 'pg';

import {
  formatJSONErrorResponse,
  formatJSONResponse,
} from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { dbOptions } from '../../dbOptions';
import { StatusCodes } from 'http-status-codes';

export const getProductsById = async (event) => {
  console.log(`[${new Date().toLocaleString()}]`);
  console.log('[REQUEST]: get a product by id');
  console.log(`[Path parameters]: ${JSON.stringify(event.pathParameters)}`);
  const client = new Client(dbOptions);
  try {
    await client.connect();
    const queryResult = await client.query(`
    select
      products.id as id,
      stocks.count as count,
      products.title as title,
      products.description as description,
      products.price as price,
      products.image as image
    from products
    join stocks
    on products.id = stocks.product_id
    where products.id = '${event.pathParameters?.id}'
    `);
    if (!queryResult.rows.length) {
      return formatJSONErrorResponse(
        StatusCodes.NOT_FOUND,
        'Product not found.'
      );
    }
    return formatJSONResponse(queryResult.rows[0]);
  } catch (error) {
    if (error.code === '22P02') {
      return formatJSONErrorResponse(
        StatusCodes.NOT_FOUND,
        'Product not found.'
      );
    }
    return formatJSONErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went terribly wrong.'
    );
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsById);
