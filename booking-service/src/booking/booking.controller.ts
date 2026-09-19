import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { CreateBookingDto } from './dtos/create-booking.dto';
import { BookingService } from './booking.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(Number(id));
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(Number(id));
  }
}
