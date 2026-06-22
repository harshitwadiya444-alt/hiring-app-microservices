import { getIO } from "./socketServer.js";

export const sendSocketNotification = ({userId,message})=>{

  const io = getIO();

  io.to(userId).emit("notification",{  
    message
  });

};