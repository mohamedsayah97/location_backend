import { Module } from '@nestjs/common';

import { VehiculeModule } from './vehicule/vehicule.module';

@Module({
  imports: [VehiculeModule],
})
export class AppModule {}
