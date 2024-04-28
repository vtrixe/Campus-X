import { Kafka, Producer, logLevel } from 'kafkajs';
import { db } from './db';

const kafka = new Kafka({
  brokers: [''],
  ssl: true,
  sasl: {
      mechanism: 'scram-sha-256',
      username: '',
      password: ''
  },
  logLevel: logLevel.ERROR,
});


let producer: null | Producer = null;

export async function createProducer() {
    if (producer) return producer;
  
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    console.log("producer Created Successfully");
    return producer;




  }


  export async function produceMessage(message: string) {
    const producer = await createProducer();
    await producer.send({
      messages: [{ key: `message-${Date.now()}`, value: message }],
      topic: "MESSAGES",
    });
    console.log("message Sent By Producer Successfully");
    
    return true;
  }



  export async function startMessageConsumer() {
    console.log("Consumer is running..");
    const consumer = kafka.consumer({ groupId: "default" });
    await consumer.connect();
    await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
  
    await consumer.run({
      autoCommit: true,
      eachMessage: async ({ message, pause }) => {
        if (!message.value) return;
        console.log(`New Message Recv..`);
        try {
        } catch (err) {
          console.log("Something is wrong");
          pause();
          setTimeout(() => {
            consumer.resume([{ topic: "MESSAGES" }]);
          }, 60 * 1000);
        }
      },
    });
  }
  export default kafka;

