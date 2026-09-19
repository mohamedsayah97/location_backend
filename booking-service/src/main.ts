import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import 'dotenv/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'booking-service',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'booking-consumer',
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3002);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
