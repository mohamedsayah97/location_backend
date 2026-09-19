import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('booking_created')
  async handleBookingCreated(@Payload() data: any) {
    console.log('🔥 Booking event received:', data);

    const vehicle = await this.appService.reserveVehicle(data.vehicleId);

    console.log('🚗 Vehicle updated:', vehicle);
  }
}
