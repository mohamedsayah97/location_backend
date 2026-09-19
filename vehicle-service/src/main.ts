import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'vehicle-service',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'vehicle-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
