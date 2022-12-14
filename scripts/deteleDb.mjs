import { dynamoDb } from "../lib/aws.mjs";

const TABLES = [
    'QRCodes',
];

(async () => {
    for (let table of TABLES) {
        console.log(`\n\nš§ Removing table: ${table}`);
        try {
            await dynamoDb.deleteTable({ TableName: table }).promise();
            console.log(`š Removed successfully: ${table}`);
        } catch (e) {
            console.log(`š„ Failed to remove: ${table}`);
            console.log(`š Error: ${e.message}, ${e.stack}`);
        }
    }
    console.log('\n\n All removing steps complete.');
})();