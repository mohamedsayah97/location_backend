jest.mock('../prisma.service', () => ({
  PrismaService: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { PrismaService } from '../prisma.service';


describe('VehiculeService', () => {
  let service: VehiculeService;

  const prismaMock = {
    vehicle: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculeService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<VehiculeService>(VehiculeService);

    jest.clearAllMocks();
  });

  describe('create Vehicle', () => {
    it('should create a new vehicle', async () => {
      const vehicleData = {
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        price: 25000,
      };

      prismaMock.vehicle.create.mockResolvedValue({
        id: 1,
        ...vehicleData,
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(vehicleData);

      expect(result).toEqual({
        id: 1,
        ...vehicleData,
        status: 'AVAILABLE',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(prismaMock.vehicle.create).toHaveBeenCalledWith({
        data: {
          ...vehicleData,
          status: 'AVAILABLE',
        },
      });
    });
  });
});