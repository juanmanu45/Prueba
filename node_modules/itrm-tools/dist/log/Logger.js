"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const axios_1 = __importDefault(require("axios"));
class Logger {
    constructor(executor, url) {
        this.executor = executor;
        this.url = url;
    }
    requestExecutionId() {
        return new Promise((resolve, reject) => {
            axios_1.default.post(this.executor + "/generateid", {}, { headers: { 'Content-Type': 'application/json' } })
                .then(response => { resolve(response.data); })
                .catch(err => { reject(err); });
        });
    }
    send(log) {
        return new Promise((resolve, reject) => {
            axios_1.default.post(this.url, { log: log }, { headers: { 'Content-Type': 'application/json' } })
                .then(response => { resolve(response.data); })
                .catch(err => { reject(err); });
        });
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map