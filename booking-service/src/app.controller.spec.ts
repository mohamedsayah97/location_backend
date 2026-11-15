
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  const kafkaMock = {
    emit: jest.fn().mockReturnValue('mocked-event'),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: 'KAFKA_SERVICE',
          useValue: kafkaMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should emit booking_created event', () => {
      const result = appController.createBooking();

      expect(kafkaMock.emit).toHaveBeenCalledWith(
        'booking_created',
        {
          bookingId: 1,
          vehicleId: 10,
          customerId: 5,
        },
      );

      expect(result).toBe('mocked-event');
    });
  });
});
