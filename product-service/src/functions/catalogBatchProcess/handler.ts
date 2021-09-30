import 'source-map-support/register';

import { middyfy } from '../../libs/lambda';

export const catalogBatchProcess = async (event) => {
  const products = event.Records.map(({ body }) => body);

  console.log(products);
};

export const main = middyfy(catalogBatchProcess);
