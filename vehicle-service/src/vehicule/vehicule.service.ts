import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { CreateVehicleDto } from './dtos/create-vehicule.dto';

@Injectable()
export class VehiculeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        brand: dto.brand,
        model: dto.model,
        year: dto.year,
        price: dto.price,
      },
    });
  }

  async findAll() {
    return this.prisma.vehicle.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }

    return vehicle;
  }
}
