import amqp = require('amqplib');
import { QUEUE_NAME, RABBIT_ENDPOINT, EXIT_TIMEOUT } from './consts';
import run from './run';
import sleep from './utils/sleep';

export default async () => {
  try {
    const connection = await amqp.connect(RABBIT_ENDPOINT);
    const channel = await connection.createChannel();
    channel.assertQueue(QUEUE_NAME);
    channel.prefetch(1);
    channel.on('close', () => process.exit(1));
    channel.on('error', error => {
      console.error('ERROR ON CHANNEL', error);
      process.exit(1);
    });
    console.log('WAITING TASKS ON QUEUE:', RABBIT_ENDPOINT, QUEUE_NAME);
    channel.consume(QUEUE_NAME, async msg => {
      const { cid, pkg, packageLock, yarnLock, production } = JSON.parse(msg.content.toString());
      await run(cid, pkg, { packageLock, yarnLock, production });
      channel.ack(msg);
    });
  } catch (error) {
    console.error('RABBIT CONNECTION ERROR', error);
    await sleep(EXIT_TIMEOUT);
    process.exit(1);
  }
};
