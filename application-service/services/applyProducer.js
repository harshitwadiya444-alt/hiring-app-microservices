import { getChannel } from "./rabbit.js";

export const publishApplyJob = async(data) => {
  const channel =  await getChannel();

  channel.sendToQueue(
    "apply_job",
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );

  console.log("apply job sent");
};
