import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:5050");

ws.on("open", () => {
  console.log("connected to server");
  ws.send(JSON.stringify({eventName: 'joinRoom', payload: {room: 'room1'}}));
  setTimeout(() => {
    ws.send(JSON.stringify({eventName: 'sendMessage', payload: {room: 'room1', message: 'hello'}}))
  }, 3000)
});

ws.on("message", (data) => {
    console.log("received: %s", data);
})

ws.on("close", () => {
  console.log("disconnected");
});

