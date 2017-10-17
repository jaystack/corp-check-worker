import amqp = require('amqplib');
import { QUEUE } from './consts';

export default async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  channel.assertQueue(QUEUE);
  channel.prefetch(1);
  console.log('WAITING TASKS ON QUEUE:', QUEUE);
  channel.consume(QUEUE, async msg => {
    console.log(msg);
  });
};
