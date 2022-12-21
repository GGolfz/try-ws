import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 5050,
});

const Room: { [id: string]: WebSocket[] } = {};

const emit = (eventName: string, payload: any) => {
  return JSON.stringify({ eventName, payload });
};
wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    const { eventName, payload } = JSON.parse(message);
    if (!eventName || !payload) return;
    ws.emit(eventName, payload);
  });
  ws.on("joinRoom", (data: any) => {
    const { room } = data;
    if (!Room[room]) {
      Room[room] = [];
    }
    Room[room].push(ws);
  });
  ws.on("leaveRoom", (data: any) => {
    const { room } = data;
    Room[room] = Room[room].filter((socket: WebSocket) => socket !== ws);
  });
  ws.on("sendMessage", (data: any) => {
    const { room, message } = data;
    Room[room].forEach((socket: WebSocket) => {
      if (socket === ws) return;
      socket.send(emit("message", { message }));
    });
  });
  ws.on("close", () => {
    Object.keys(Room).forEach((room: string) => {
      Room[room] = Room[room].filter((socket: WebSocket) => socket !== ws);
    });
  });
  ws.on("getRooms", () => {
    const rooms = Object.keys(Room).map((room) => ({ name: room, member: Room[room] }));
    ws.send(emit("rooms", { rooms: rooms }));
  });
});
wss.on("listening", () => {
  console.log("listening on port 5050");
});
