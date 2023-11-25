"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerWebSocket = void 0;
const ws_1 = __importDefault(require("ws"));
class LoggerWebSocket extends ws_1.default {
    constructor(address, options) {
        super(address, options);
        this.from = 0;
        this.transactions = [];
    }
}
exports.LoggerWebSocket = LoggerWebSocket;
//# sourceMappingURL=LoggerWebSocket.js.map