import 'source-map-support/register';

import { formatJSONErrorResponse, formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import products from '../../products';

const getProductsById = async (event) => {
  const product = products.find(item => item.id === +event.pathParameters?.id);
  if (!product) {
    return formatJSONErrorResponse(404, 'Product not found.');
  }
  return formatJSONResponse(product);
}

export const main = middyfy(getProductsById);