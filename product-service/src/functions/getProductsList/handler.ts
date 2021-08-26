import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import products from '../../products';
import { Handler } from 'aws-lambda';

const product: Handler = async (_event) => {
  return formatJSONResponse(products);
};

export const main = middyfy(product);
