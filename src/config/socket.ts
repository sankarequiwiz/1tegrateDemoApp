export const url = import.meta.env.VITE_SOCKET_SERVER_URL;
import { Client } from '@stomp/stompjs';

export const socket = new Client({
   brokerURL: url
});
