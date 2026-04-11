import amqp from "amqplib";

let channel = null;

export const connectNotificationQueue = async () => {

  const connection = await amqp.connect(process.env.RABBITMQ_URL);

  channel = await connection.createChannel();

  await channel.assertQueue("notifications",{durable:true});

  console.log("Notification Producer Connected");

};

export const publishStatusUpdate = async (data)=>{

  if(!channel){
    console.log("Notification channel not initialized");
    return;
  }

  channel.sendToQueue(
    "notifications",
    Buffer.from(JSON.stringify(data)),
    {persistent:true}
  );

  console.log("Notification event published");

};