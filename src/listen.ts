import amqp = require('amqplib');
import { QUEUE_NAME, RABBIT_ENDPOINT, EXIT_TIMEOUT } from './consts';
import run from './run';
import sleep from './utils/sleep';

const handleClose = title => async error => {
  console.error(title, error || '');
  await sleep(EXIT_TIMEOUT);
  process.exit(1);
};

export default async () => {
  try {
    const connection = await amqp.connect(RABBIT_ENDPOINT);
    connection.on('close', handleClose('CONNECTION CLOSE'));
    connection.on('error', handleClose('CONNECTION ERROR'));
    const channel = await connection.createChannel();
    channel.assertQueue(QUEUE_NAME);
    channel.prefetch(1);
    channel.on('close', handleClose('CHANNEL CLOSE'));
    channel.on('error', handleClose('CHANNEL ERROR'));
    console.log('WAITING TASKS ON QUEUE:', RABBIT_ENDPOINT, QUEUE_NAME);
    channel.consume(QUEUE_NAME, async msg => {
      const { cid, pkg, packageLock, yarnLock, production } = JSON.parse(msg.content.toString());
      await run(cid, pkg, { packageLock, yarnLock, production });
      channel.ack(msg);
    });
  } catch (error) {
    await handleClose('COULD NOT CONNECT TO RABBIT')(error);
  }
};
