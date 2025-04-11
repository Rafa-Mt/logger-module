import { io } from 'socket.io-client';
import { BACKEND_PORT } from '@/constants';

const url = `http://localhost:${BACKEND_PORT}`;
export const socket = io(url, {
    autoConnect: true,
});