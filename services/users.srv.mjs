import { createUserEntry } from "../dal/qr.db-access.mjs";

export const registerUser = async (clientNumber) => {
    await createUserEntry({
        clientNumber,
        urlUuid: 'unset', // empty string not allowed since it's a secondary index in dynamodb
        status: 'pending',
        updatedAt: (new Date()).toISOString()
    });
};