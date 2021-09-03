import 'source-map-support/register';
import { Client } from 'pg';

import { formatJSONErrorResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { dbOptions } from '../../dbOptions';

export const getProductsById = async (event) => {
  const client = new Client(dbOptions);
  try {
    await client.connect();
    const { rows: product } = await client.query(`
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
    if (!product.length) {
      return formatJSONErrorResponse(404, 'Product not found.');
    }
    return product[0];
  } catch (error) {
    return formatJSONErrorResponse(500, 'Something went terribly wrong.');
  }
};

export const main = middyfy(getProductsById);
