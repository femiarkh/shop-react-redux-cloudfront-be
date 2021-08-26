import { getProductsList } from './handler';

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

describe('getProductsList handler', () => {
  it('returns array with products', () => {
    const mockEvent = {};
    return getProductsList(mockEvent).then((response) => {
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toStrictEqual([
        {
          id: 1,
          title: 'test-product',
          description: 'This is just a test.',
          price: 9999,
          count: 1,
          image: 'https://path/to/image',
        },
      ]);
    });
  });
});
