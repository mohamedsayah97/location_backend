import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { CreateVehicleDto } from './dtos/create-vehicule.dto';
import { VehiculeService } from './vehicule.service';
import { UpdateVehiculeStatusDto } from './dtos/update-vehicule-status.dto';

@Controller('vehicles')
export class VehiculeController {
  constructor(private readonly vehicleService: VehiculeService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get()
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(Number(id));
  }
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateVehiculeStatusDto) {
    return this.vehicleService.updateStatus(Number(id), dto.status);
  }
  @EventPattern('booking_created')
  async handleBookingCreated(
    @Payload()
    data: {
      bookingId: number;
      vehicleId: number;
    },
  ) {
    return this.vehicleService.reserveVehicle(data.vehicleId);
  }
  @EventPattern('booking_cancelled')
  async handleBookingCancelled(
    @Payload()
    data: {
      bookingId: number;
      vehicleId: number;
    },
  ) {
    return this.vehicleService.releaseVehicle(data.vehicleId);
  }
}
