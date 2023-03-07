import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cors())

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER]
      },
      consumer: {
        // generate random groupId if in development, otherwise, use the env variable
        groupId:
          !process.env.KAFKA_CONSUMER_GROUP_ID ||
            process.env.KAFKA_CONSUMER_GROUP_ID === ''
            ? 'my-consumer-' + Math.random()
            : process.env.KAFKA_CONSUMER_GROUP_ID,
      }
    }
  })

  await app.startAllMicroservices()
  await app.listen(3000);
}
bootstrap()
