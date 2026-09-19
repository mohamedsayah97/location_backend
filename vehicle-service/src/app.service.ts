import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async reserveVehicle(vehicleId: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
    });

    if (!vehicle) {
      console.log(`❌ Vehicle ${vehicleId} not found`);
      return null;
    }

    if (vehicle.status !== 'AVAILABLE') {
      console.log(`❌ Vehicle ${vehicleId} is already ${vehicle.status}`);
      return null;
    }

    const updatedVehicle = await this.prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        status: 'RESERVED',
      },
    });

    console.log(`🚗 Vehicle ${vehicleId} is now RESERVED`);

    return updatedVehicle;
  }
}
