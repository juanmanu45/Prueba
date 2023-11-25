export declare class Logger {
    private executor;
    private url;
    constructor(executor: string, url: string);
    requestExecutionId(): Promise<any>;
    send(log: any): Promise<any>;
}
