import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { CreateVehicleDto } from './dtos/create-vehicule.dto';
import { VehicleStatus } from '../generated/client';

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
        status: 'AVAILABLE',
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

  async updateStatus(id: number, status: VehicleStatus) {
    await this.findOne(id);

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        status,
      },
    });
  }
  async reserveVehicle(vehicleId: number) {
    const vehicle = await this.findOne(vehicleId);

    if (vehicle.status !== 'AVAILABLE') {
      return vehicle;
    }

    return this.prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        status: 'RESERVED',
      },
    });
  }
  async releaseVehicle(vehicleId: number) {
    const vehicle = await this.findOne(vehicleId);

    if (vehicle.status !== 'RESERVED') {
      return vehicle;
    }

    return this.prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        status: 'AVAILABLE',
      },
    });
  }
}
