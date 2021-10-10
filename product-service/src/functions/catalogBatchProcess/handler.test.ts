import * as AWSMock from 'aws-sdk-mock';
import { catalogBatchProcess } from './handler';

jest.mock('../../libs/lambda', () => ({
  middyfy: jest.fn(),
}));
jest.mock('../../libs/validateProduct', () => ({
  validateProduct: jest.fn((obj) => obj),
}));
let mockQuery = jest.fn(() => ({
  rows: [{ id: 'newProductId' }],
}));
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

const mockEvent = {
  Records: [
    {
      body: JSON.stringify({
        title: 'new bike',
        description: 'this touring bike is super cool',
        price: '9999',
        count: '1',
        image: 'http://cool-bike-pictures.org/the-best-bike-in-the-world.jpg',
      }),
    },
  ],
};

describe('importProductsFile', () => {
  beforeAll(() => {
    AWSMock.mock('SNS', 'publish', 'test-message');
  });
  afterAll(() => {
    AWSMock.restore('SNS', 'publish');
  });
  it('returns 200 when everything is ok', async () => {
    const result = await catalogBatchProcess(mockEvent);
    expect(result.statusCode).toBe(200);
  });
  it('returns 500 when something goes wrong', async () => {
    mockQuery.mockImplementationOnce(() => {
      throw new Error();
    });
    const result = await catalogBatchProcess(mockEvent);
    expect(result.statusCode).toBe(500);
  });
  it('publishes a message', async () => {
    const mockCallback = jest.fn((params, cb) => cb(params));
    AWSMock.remock('SNS', 'publish', mockCallback);
    await catalogBatchProcess(mockEvent);
    expect(mockCallback.mock.calls[0][0].Subject).toBe(
      'New bike was added to the db!'
    );
  });
});
