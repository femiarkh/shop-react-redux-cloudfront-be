import 'source-map-support/register';

import {
  formatJSONErrorResponse,
  formatJSONResponse,
} from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

import products from '../../products';

export const getProductsById = async (event) => {
  try {
    const product = products.find(
      (item) => item.id === +event.pathParameters?.id
    );
    if (!product) {
      return formatJSONErrorResponse(404, 'Product not found.');
    }
    const response = formatJSONResponse(product);
    return response;
  } catch (error) {
    return formatJSONErrorResponse(500, 'Something went terribly wrong.');
  }
};

export const main = middyfy(getProductsById);
