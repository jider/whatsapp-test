import AWS from 'aws-sdk';

const BASE_CONFIG = {
    region: 'eu-west-1'
};
const DYNAMO_CONFIG = {
    dynamodb: {
        endpoint: "http://localhost:8042",
    }
};
AWS.config.update({
    ...BASE_CONFIG,
    ...DYNAMO_CONFIG
});

export const dynamoDb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

export const dynamoDocClient = new AWS.DynamoDB.DocumentClient();