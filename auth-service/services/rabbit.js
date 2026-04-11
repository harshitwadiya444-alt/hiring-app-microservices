import amqp from "amqplib";

let channel = null;
let connection = null;

export const connectRabbitMQ = async () => {

  if (channel) return channel;

  try {

    connection = await amqp.connect(process.env.RABBITMQ_URL);

    channel = await connection.createChannel();

    await channel.assertQueue("resume_queue", { durable: true });
    await channel.assertQueue("apply_job", { durable: true });
    await channel.assertQueue("job_queue", { durable: true });

    console.log("✅ RabbitMQ connected & queues asserted");

    return channel;

  } catch (err) {

    console.error("❌ RabbitMQ connection failed:", err.message);
    throw err;

  }
};

export const getChannel = async () => {

  if (!channel) {
    await connectRabbitMQ();
  }

  return channel;
};