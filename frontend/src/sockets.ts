import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND; 

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Don't connect until user logs in
  withCredentials: true
});