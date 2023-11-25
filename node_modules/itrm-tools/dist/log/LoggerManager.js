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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerManager = void 0;
const LoggerWebSocket_1 = require("./LoggerWebSocket");
class LoggerManager {
    constructor(url) {
        this.url = url;
    }
    connect() {
        return new Promise((resolve, reject) => {
            let client = new LoggerWebSocket_1.LoggerWebSocket(this.url);
            client.on('open', () => {
                console.log("> client connected");
                resolve(client);
            });
            client.on('message', function (data) {
                let message = data.toString();
                let datum = JSON.parse(message);
                if (datum.action === 'LOG') {
                    delete datum.payload.log._id;
                    if (datum.payload.log.timestamp >= client.from)
                        client.transactions.push(datum.payload.log);
                }
                else if (datum.action === 'FINISHED') {
                    console.log("> finished");
                    client.resolve(client.transactions);
                }
                else if (datum.action === 'EMPTY_ID') {
                    console.log("> EMPTY_ID: ", datum.payload.message);
                    client.resolve([]);
                }
                else {
                    console.log("> unrecognizeable message: ", message);
                    client.resolve([]);
                }
            });
        });
    }
    requestNextLogs(client, executionId) {
        return __awaiter(this, void 0, void 0, function* () {
            client.transactions = [];
            let logs = yield new Promise((resolve, reject) => {
                client.resolve = resolve;
                client.reject = reject;
                console.log("> requesting:", executionId);
                client.send(executionId);
            });
            logs.sort(function (a, b) { return a.timestamp - b.timestamp; });
            console.log("> logs:", logs.length);
            return logs;
        });
    }
}
exports.LoggerManager = LoggerManager;
//# sourceMappingURL=LoggerManager.js.map