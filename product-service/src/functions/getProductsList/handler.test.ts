import { getProductsList } from './handler';

const testProducts = [
  {
    id: '1',
    title: 'test-product',
    description: 'This is just a test.',
    price: 9999,
    count: 1,
    image: 'https://path/to/image',
  },
];

const mockClient = {
  connect: jest.fn(),
  query: jest.fn(() => ({
    rows: testProducts,
  })),
  end: jest.fn(),
};

jest.mock('pg', () => {
  return {
    Client: jest.fn(() => mockClient),
  };
});

describe('getProductsList handler', () => {
  it('returns array with products', () => {
    const mockEvent = {};
    return getProductsList(mockEvent).then((response) => {
      expect(mockClient.query).toBeCalledTimes(1);
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toStrictEqual([
        {
          id: '1',
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
