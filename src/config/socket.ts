import SockJS from "sockjs-client/dist/sockjs"
import Stomp from 'stompjs';

const url = import.meta.env.VITE_SOCKET_SERVER_URL;
const socketClient = new SockJS(url);
export const socket = Stomp.over(socketClient)
