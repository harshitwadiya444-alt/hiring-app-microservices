import { io } from "socket.io-client";

const socket = io("http://localhost:4004" ,{
      withCredentials:true
});

export default socket;