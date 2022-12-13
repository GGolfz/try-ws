import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
    port: 5050,
});

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        console.log('received: %s', message);
    })
});
wss.on('listening', () => {
    console.log('listening on port 5050');
})
