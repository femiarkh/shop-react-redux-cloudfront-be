import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';

import { importProductsFile } from './handler';

jest.mock('../../libs/lambda', () => ({
  middyfy: jest.fn(),
}));
console.error = jest.fn();

describe('importProductsFile', () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });
  afterEach(() => {
    AWSMock.restore('S3');
  });
  it('should return signed url', async () => {
    AWSMock.mock('S3', 'getSignedUrl', (_operation, _params, callback) => {
      return callback(null, 'signed url');
    });
    const result = await importProductsFile({
      queryStringParameters: { name: 'test' },
    } as unknown as APIGatewayProxyEvent);
    expect(JSON.parse(result.body).url).toBe('signed url');
  });
  it('should pass file name to params', async () => {
    AWSMock.mock('S3', 'getSignedUrl', (_operation, params, callback) => {
      return callback(null, params.Key);
    });
    const result = await importProductsFile({
      queryStringParameters: { name: 'testFile.csv' },
    } as unknown as APIGatewayProxyEvent);
    expect(JSON.parse(result.body).url).toBe('uploaded/testFile.csv');
  });
  it('should return statusCode 500 in case of error', async () => {
    AWSMock.mock('S3', 'getSignedUrl', (_operation, _params, _callback) => {
      throw new Error();
    });
    const result = await importProductsFile({
      queryStringParameters: { name: 'error test' },
    } as unknown as APIGatewayProxyEvent);
    expect(result.statusCode).toBe(500);
  });
});
