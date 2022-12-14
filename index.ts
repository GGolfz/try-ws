import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
    port: 5050,
});

const Room: {[id: string]: WebSocket[]} = {}

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        console.log('received: %s', message);
        const {eventName, payload} = JSON.parse(message)
        ws.emit(eventName, payload)
    })
    ws.on('joinRoom', (data: any) => {
        const {room} = data
        if (!Room[room]) {
            Room[room] = []
        }
        Room[room].push(ws)
    })
    ws.on('leaveRoom', (data: any) => {
        const {room} = data
        Room[room] = Room[room].filter((socket: WebSocket) => socket !== ws)
    })
    ws.on('sendMessage', (data: any) => {
        const {room, message} = data
        Room[room].forEach((socket: WebSocket) => {
            if(socket === ws) return
            socket.send(JSON.stringify({eventName: 'message', payload: {message}}))
        })
    })
});
wss.on('listening', () => {
    console.log('listening on port 5050');
})
