import io from 'socket.io-client';

const url = import.meta.env.VITE_ITEGRATE_BASE_URL;

export const socket = io(url, { autoConnect: false });