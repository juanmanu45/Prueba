import { LoggerWebSocket } from "./LoggerWebSocket";
export declare class LoggerManager {
    private url;
    constructor(url: string);
    connect(): Promise<LoggerWebSocket>;
    requestNextLogs(client: LoggerWebSocket, executionId: string): Promise<any[]>;
}
