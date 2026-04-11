import { getChannel } from "./rabbit.js";

export const sendToJobQueue = async(payload) => {
  const channel =  await getChannel();

  channel.sendToQueue(
    "job_queue",
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );

  console.log("job embedding task sent");
};
