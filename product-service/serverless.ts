import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import addProduct from '@functions/addProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

dotenv.config();
const {
  PG_HOST,
  PG_PORT,
  PG_DATABASE,
  PG_USERNAME,
  PG_PASSWORD,
  TEST_EMAIL_1,
  TEST_EMAIL_2,
} = process.env;

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST,
      PG_PORT,
      PG_DATABASE,
      PG_USERNAME,
      PG_PASSWORD,
      SQS_URL: {
        Ref: 'SQSQueue',
      },
      SNS_ARN: {
        Ref: 'SNSTopic',
      },
    },
    lambdaHashingVersion: '20201221',
    stage: 'dev',
    region: 'eu-west-1',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'SNSTopic',
        },
      },
    ],
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
          VisibilityTimeout: 30,
          MessageRetentionPeriod: 60,
          RedrivePolicy: {
            deadLetterTargetArn: {
              'Fn::GetAtt': ['ReceiverDeadLetterQueue', 'Arn'],
            },
            maxReceiveCount: 1,
          },
        },
      },
      ReceiverDeadLetterQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'receiverDLQ',
          MessageRetentionPeriod: 259200,
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'rss-aws-2021-sns-topic',
        },
      },
      SNSSubscriptionOne: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: TEST_EMAIL_1,
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
          FilterPolicy: {
            price: [{ numeric: ['<', 100] }],
          },
        },
      },
      SNSSubscriptionTwo: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: TEST_EMAIL_2,
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
          FilterPolicy: {
            price: [{ numeric: ['>=', 100] }],
          },
        },
      },
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsById,
    addProduct,
    catalogBatchProcess,
  },
};

module.exports = serverlessConfiguration;
