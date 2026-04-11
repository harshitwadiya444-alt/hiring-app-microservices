import amqp from "amqplib";
import { getChannel } from "./rabbit.js";


export const sendToResumeQueue = async(payload) => {
  const channel = await getChannel();
 
  channel.sendToQueue(
    "resume_queue",
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
  console.log("resume job sent");
};
