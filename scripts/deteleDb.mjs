import { dynamoDb } from "../lib/aws.mjs";

const TABLES = [
    'QRCodes',
];

(async () => {
    for (let table of TABLES) {
        console.log(`\n\n🔧 Removing table: ${table}`);
        try {
            await dynamoDb.deleteTable({ TableName: table }).promise();
            console.log(`🎉 Removed successfully: ${table}`);
        } catch (e) {
            console.log(`🔥 Failed to remove: ${table}`);
            console.log(`🚒 Error: ${e.message}, ${e.stack}`);
        }
    }
    console.log('\n\n All removing steps complete.');
})();