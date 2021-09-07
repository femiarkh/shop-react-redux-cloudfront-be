import { getProductsById } from './handler';

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

let id: string;
let mockQuery = jest.fn();

const mockClient = {
  connect: jest.fn(),
  query: mockQuery,
  end: jest.fn(),
};

jest.mock('pg', () => {
  return {
    Client: jest.fn(() => mockClient),
  };
});

describe('getProductsById handler', () => {
  it('returns specified product', () => {
    const mockEvent = {
      pathParameters: {
        id: '1',
      },
    };
    id = mockEvent.pathParameters.id;
    mockQuery.mockImplementationOnce(() => ({
      rows: testProducts.filter((product) => product.id === id),
    }));
    return getProductsById(mockEvent).then((response) => {
      expect(JSON.parse(response.body).title).toBe('test-product');
    });
  });
  it('replies with 404 if the product is not found', () => {
    const mockEvent = {
      pathParameters: {
        id: '2',
      },
    };
    id = mockEvent.pathParameters.id;
    mockQuery.mockImplementationOnce(() => ({
      rows: testProducts.filter((product) => product.id === id),
    }));
    return getProductsById(mockEvent).then((response) => {
      expect(response.statusCode).toBe(404);
    });
  });
});
