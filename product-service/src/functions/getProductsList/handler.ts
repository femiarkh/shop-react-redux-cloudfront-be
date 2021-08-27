import 'source-map-support/register';

import {
  formatJSONErrorResponse,
  formatJSONResponse,
} from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

import products from '../../products';

export const getProductsList = async (_event) => {
  try {
    const response = formatJSONResponse(products);
    return response;
  } catch (error) {
    return formatJSONErrorResponse(500, 'Something went terribly wrong.');
  }
};

export const main = middyfy(getProductsList);
