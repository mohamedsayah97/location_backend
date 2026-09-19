import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { VehiculeController } from './vehicule.controller';
import { VehiculeService } from './vehicule.service';

@Module({
  controllers: [VehiculeController],
  providers: [VehiculeService, PrismaService],
})
export class VehiculeModule {}
