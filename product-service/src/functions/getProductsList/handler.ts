import 'source-map-support/register';

import { formatJSONResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

import products from '../../products';

export const getProductsList = async (_event) => {
  return formatJSONResponse(products);
};

export const main = middyfy(getProductsList);
