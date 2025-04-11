import { types, methods } from '@common/consts';

export type LogType = typeof types[number];
export type HttpMethod = typeof methods[number];

export interface RouteLog {
    ip: string,
    method: HttpMethod,
    endpoint: string,
    body?: Record<string, any>,
    params?: Record<string, string | number>
    timestamp: Date
}

export interface CustomLog {
    type: LogType,
    message: string,
    timestamp: Date
}