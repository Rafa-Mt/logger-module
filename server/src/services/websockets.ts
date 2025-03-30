import { WebSocketServer, WebSocket } from "ws";
import { Server as HttpServer, IncomingMessage } from "http";

export const create = (httpServer: HttpServer) => {
    const socketServer = new WebSocketServer({server: httpServer})

    socketServer.on("connection", (socket: WebSocket) => {
        socket.send("connected")

        // * ...
    })
}