import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,

    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async create(dto: CreateBookingDto) {
    const response = await firstValueFrom(
      this.httpService.get(`http://localhost:3001/vehicles/${dto.vehicleId}`),
    );

    const vehicle = response.data;

    if (vehicle.status !== 'AVAILABLE') {
      throw new BadRequestException('Vehicle is not available');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    const durationMs = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      throw new BadRequestException('End date must be after start date');
    }

    const totalPrice = vehicle.price * days;

    const booking = await this.prisma.booking.create({
      data: {
        userId: dto.userId,
        vehicleId: dto.vehicleId,
        startDate,
        endDate,
        totalPrice,
      },
    });

    this.kafkaClient.emit('booking_created', {
      bookingId: booking.id,
      vehicleId: booking.vehicleId,
    });

    return booking;
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
    const booking = await this.findOne(id);

    const deletedBooking = await this.prisma.booking.delete({
      where: {
        id,
      },
    });

    this.kafkaClient.emit('booking_cancelled', {
      bookingId: booking.id,
      vehicleId: booking.vehicleId,
    });

    return deletedBooking;
  }
}
