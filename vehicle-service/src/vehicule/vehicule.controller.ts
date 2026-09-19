import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { CreateVehicleDto } from './dtos/create-vehicule.dto';
import { VehiculeService } from './vehicule.service';

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
}
