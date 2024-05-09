export const url = import.meta.env.VITE_SOCKET_SERVER_URL;
import { Client } from '@stomp/stompjs';

export const socket = new Client({
   brokerURL: url,
   reconnectDelay: 5000,
   heartbeatIncoming: 4000,
   heartbeatOutgoing: 4000,
});
