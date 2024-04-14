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
const client = (0, redis_1.createClient)();
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        while (true) {
            try {
                console.log("waiting for submission");
                const submission = yield client.blPop("submission", 0);
                console.log(submission, "from worker published to pub/sub");
                yield client.publish("problem_done", `${JSON.stringify({
                    status: "done",
                    timeComplexity: "O(n)",
                    spaceComplexity: "O(1)",
                    output: "true",
                    error: "null",
                })}`);
                // send response as websocket to pub/sub
                // websocket server will send response to client
            }
            catch (err) {
                console.error(err.message);
            }
        }
    });
}
main();
//  worker
// frontend ---> primary server
