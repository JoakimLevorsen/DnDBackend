import character from "./character";

export default (socket: WebSocket) => ({ character: character(socket) });
