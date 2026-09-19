import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @IsNumber()
  @Min(0)
  price!: number;
}
