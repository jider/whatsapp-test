const fs = require('node:fs');

const makeWASocket = require('@adiwajshing/baileys').default;
const {
    DisconnectReason,
    downloadHistory,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    useMultiFileAuthState
} = require('@adiwajshing/baileys');

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
// const store = makeInMemoryStore({});
// // can be read from a file
// store?.readFromFile('./wa_store.json');
// // saves the state to a file every 10s
// setInterval(() => {
//     store?.writeToFile('./wa_store.json');
// }, 10_000);

async function historyCapture(historicSync) {
    const history = await downloadHistory(historicSync);

    fs.writeFile(`./historyCapture/history.json`, JSON.stringify(history), 'utf8', () => {
        console.log('Done!');
    });
}

async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    // fetch the latest version of WA Web
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`--- Using WA v${version.join('.')}, isLatest: ${isLatest}`)

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        syncFullHistory: true,
        version
    });

    // will listen from this socket
    // the store can listen from a new socket once the current socket outlives its lifetime
    // store.bind(sock.ev);

    // this will be called as soon as the credentials are updated
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const {connection, lastDisconnect} = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            // Reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Opened connection!!');
        }
    });

    sock.ev.on('messages.upsert', ({ messages }) => {
        for (const msg of messages) {
            const msgType = msg.message?.protocolMessage?.type;

            if (msgType === 5) { // "HISTORY_SYNC_NOTIFICATION"
                const historySyncNotification = msg.message?.protocolMessage?.historySyncNotification;
                if (historySyncNotification?.syncType === 2) { // 'FULL'
                    console.log('--- MSG Progress:', historySyncNotification?.progress);
                    if (historySyncNotification?.progress === 100) {
                        console.log('--- MSG:', JSON.stringify(historySyncNotification, undefined, 2));
                        historyCapture(historySyncNotification);
                    }
                }
            }
        }
    });
}

connectToWhatsApp();
