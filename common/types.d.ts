import { types, methods } from '@common/consts';

export type LogType = typeof types[number];
export type HttpMethod = typeof methods[number];

export interface RouteLog {
    ip: string,
    type: LogType,
    method: HttpMethod,
    endpoint: string,
    body?: Record<string, any>,
    params?: Record<string, string | number>
}