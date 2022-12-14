import { dynamoDb } from "../lib/aws.mjs";

const createQrCodesTable = async () => {
    return dynamoDb.createTable({
        TableName: "QRCodes",
        AttributeDefinitions: [
            {
                AttributeName: 'clientNumber',
                AttributeType: 'S',
            },
            {
                AttributeName: 'urlUuid',
                AttributeType: 'S',
            },
        ],
        KeySchema: [
            {
                AttributeName: 'clientNumber',
                KeyType: 'HASH'
            }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: "qrCodesUuidIndex",
                KeySchema: [
                    {
                        AttributeName: 'urlUuid',
                        KeyType: 'HASH'
                    }
                ],
                Projection: {
                    ProjectionType: "ALL"
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 2,
                    WriteCapacityUnits: 2,
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2
        },
    }).promise();
};

const TABLES = [
    {
        name: 'QRCodes',
        func: createQrCodesTable,
    }
];

(async () => {
    for (let table of TABLES) {
        console.log(`\n\nš§ Provisioning table: ${table.name}`);
        try {
            await table.func();
            console.log(`š Provisioned successfully: ${table.name}`);
        } catch (e) {
            console.log(`š„ Failed to provision: ${table.name}`);
            console.log(`š Error: ${e.message}, ${e.stack}`);
        }
    }
    console.log('\n\n All provisioning steps complete.');
})();