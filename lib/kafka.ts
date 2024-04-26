import { Kafka, Producer, logLevel } from 'kafkajs';

const kafka = new Kafka({
  brokers: ['cute-tick-11655-us1-kafka.upstash.io:9092'],
  ssl: true,
  sasl: {
      mechanism: 'scram-sha-256',
      username: 'Y3V0ZS10aWNrLTExNjU1JP6BMhcf_TR3WBTE0W8kxp8aY4xZoWquqPvWw0QUjLI',
      password: 'MWU4MGVlZDUtMzcyNS00ZDIzLWEyNzYtMzFjMTM0ZDc2M2My'
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


