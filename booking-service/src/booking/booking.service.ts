import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        userId: dto.userId,
        vehicleId: dto.vehicleId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        totalPrice: 0,
      },
    });
  }
  async findAll() {
    return this.prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    return booking;
  }
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.booking.delete({
      where: {
        id,
      },
    });
  }
}
