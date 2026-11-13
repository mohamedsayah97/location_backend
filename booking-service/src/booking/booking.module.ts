import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [
    HttpModule,

    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'booking-service-producer',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
        },
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
