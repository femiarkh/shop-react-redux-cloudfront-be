import { addProduct } from './handler';

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

jest.mock('./validate', () => ({
  validateProduct: jest.fn(() => []),
}));

describe('addProduct handler', () => {
  let mockEvent;
  beforeEach(() => {
    mockEvent = {
      body: {
        id: '1',
        title: 'test-product',
        description: 'This is just a test.',
        price: 9999,
        count: 1,
        image: 'https://path/to/image',
      },
    };
  });
  it('makes queries with product data to the db', () => {
    return addProduct(mockEvent).then(() => {
      expect(mockQuery).toBeCalledTimes(2);
      expect(mockQuery.mock.calls[0][0].trim()).toBe(
        `insert into products (title, description, price, image) values
        ('test-product', 'This is just a test.', 9999, 'https://path/to/image')`
      );
    });
  });
  it('responds with 500 when something goes wrong', () => {
    mockQuery.mockImplementation(() => {
      throw new Error();
    });
    return addProduct(mockEvent).then((result) => {
      expect(result.statusCode).toBe(500);
    });
  });
});
