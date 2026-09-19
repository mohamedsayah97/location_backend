import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientProxy,
  ) {}

  @Get('create-booking')
  createBooking() {
    return this.kafkaClient.emit('booking_created', {
      bookingId: 1,
      vehicleId: 10,
      customerId: 5,
    });
  }
}
