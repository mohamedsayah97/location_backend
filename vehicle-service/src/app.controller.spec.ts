
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    reserveVehicle: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('handleBookingCreated', () => {
    it('should reserve the vehicle when a booking event is received', async () => {
      const bookingData = {
        vehicleId: 1,
      };

      mockAppService.reserveVehicle.mockResolvedValue({
        id: 1,
        status: 'RESERVED',
      });

      await appController.handleBookingCreated(bookingData);

      expect(mockAppService.reserveVehicle).toHaveBeenCalledWith(1);
      expect(mockAppService.reserveVehicle).toHaveBeenCalledTimes(1);
    });
  });
});
