export const url = import.meta.env.VITE_SOCKET_SERVER_URL;
import { Client } from '@stomp/stompjs';

const { hostname, port } = window.location;
export const socket = new Client({
   brokerURL: `ws://${hostname}:${port}/ws`
});
