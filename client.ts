import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:5050');

// Simulate Message Sending

ws.on('open', () => {
    console.log('connected to server');
    ws.send('hello from client');
})