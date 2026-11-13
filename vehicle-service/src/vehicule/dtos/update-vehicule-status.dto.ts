import { IsEnum } from 'class-validator';

import { VehicleStatus } from '../../generated/client';

export class UpdateVehiculeStatusDto {
  @IsEnum(VehicleStatus)
  status!: VehicleStatus;
}
