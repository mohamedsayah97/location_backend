import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  userId!: number;

  @IsInt()
  @Min(1)
  vehicleId!: number;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;
}
