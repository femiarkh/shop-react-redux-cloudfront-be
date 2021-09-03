import 'source-map-support/register';
import { Client } from 'pg';

import { formatJSONErrorResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { dbOptions } from '../../dbOptions';

export const getProductsList = async (_event) => {
  const client = new Client(dbOptions);
  try {
    await client.connect();
    const { rows: products } = await client.query(`
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
    `);
    return products;
  } catch (error) {
    return formatJSONErrorResponse(500, 'Something went terribly wrong.');
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsList);
