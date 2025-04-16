declare module 'ping' {
    interface PingResponse {
        alive: boolean;
        time: number;
        host: string;
    }

    interface PingConfig {
        timeout?: number;
        extra?: string[];
    }

    interface PingPromise {
        probe(target: string, config?: PingConfig): Promise<PingResponse>;
    }

    export const promise: PingPromise;
} 