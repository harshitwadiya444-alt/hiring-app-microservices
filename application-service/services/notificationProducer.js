import amqp from "amqplib";

let channel = null;

export const connectNotificationQueue = async () => {

  try {

    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    channel = await connection.createChannel();

    await channel.assertQueue("notifications", { durable: true });

    console.log("Notification Producer Connected");

  } catch (error) {

    console.error("RabbitMQ connection failed:", error);

  }

};

export const publishStatusUpdate = async (data) => {

  try {

    if (!channel) {
      console.log("Notification channel not initialized");
      return;
    }

    const payload = JSON.stringify(data);

    channel.sendToQueue(
      "notifications",
      Buffer.from(payload),
      { persistent: true }
    );

    console.log("Notification event published:", payload);

  } catch (error) {

    console.error("Failed to publish notification:", error);

  }

};