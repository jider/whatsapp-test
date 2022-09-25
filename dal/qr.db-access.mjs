import { dynamoDocClient } from "../lib/aws.mjs";

const QR_CODES_TABLE = 'QRCodes';

export const createUserEntry = async (newUserEntry) => {
    return dynamoDocClient.put({
        TableName: QR_CODES_TABLE,
        Item: newUserEntry,
        ConditionExpression: 'attribute_not_exists(clientNumber)',
    }).promise();
};