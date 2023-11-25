/// <reference types="node" />
import { ClientRequestArgs } from 'http';
import WebSocket from 'ws';
export declare class LoggerWebSocket extends WebSocket {
    from: number;
    transactions: any[];
    resolve: any;
    reject: any;
    constructor(address: string, options?: WebSocket.ClientOptions | ClientRequestArgs | undefined);
}
