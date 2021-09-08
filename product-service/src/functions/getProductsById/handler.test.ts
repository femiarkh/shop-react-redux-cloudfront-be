import { getProductsById } from './handler';

jest.mock('../../products.ts', () => [
  {
    id: 1,
    title: 'test-product',
    description: 'This is just a test.',
    price: 9999,
    count: 1,
    image: 'https://path/to/image',
  },
]);

describe('getProductsById handler', () => {
  it('returns specified product', () => {
    const mockEvent = {
      pathParameters: {
        id: 1,
      },
    };
    return getProductsById(mockEvent).then((response) => {
      expect(JSON.parse(response.body).title).toBe('test-product');
    });
  });
  it('replies with 404 if the product is not found', () => {
    const mockEvent = {
      pathParameters: {
        id: 2,
      },
    };
    return getProductsById(mockEvent).then((response) => {
      expect(response.statusCode).toBe(404);
    });
  });
});
