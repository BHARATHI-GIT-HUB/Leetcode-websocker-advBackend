"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const ws_1 = require("ws");
const client = (0, redis_1.createClient)();
const app = (0, express_1.default)();
const httpServer = app.listen(8080);
const wss = new ws_1.WebSocketServer({ server: httpServer });
app.get("/", (req, res) => {
    res.send("Hello World!");
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        console.log("Socker  is running");
        wss.on("connection", function connection(ws) {
            return __awaiter(this, void 0, void 0, function* () {
                ws.on("error", console.error);
                ws.send("Connected to web socker server !!");
                yield client.subscribe("problem_done", (message, channel) => {
                    ws.send(channel + message + " response message from web socket server");
                    console.log(channel, message, " from worker published to pub/sub");
                });
            });
        });
    });
}
main();
