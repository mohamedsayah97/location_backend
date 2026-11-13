jest.mock('@nestjs/axios', () => ({
  HttpService: jest.fn(),
}));

import { of } from 'rxjs';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;

  const prismaMock = {
    booking: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  const httpMock = {
    get: jest.fn(),
  };

  const kafkaMock = {
    emit: jest.fn(),
  };

  beforeEach(() => {
    service = new BookingService(
      prismaMock as any,
      httpMock as any,
      kafkaMock as any,
    );

    jest.clearAllMocks();
  });

  test('should find a booking', async () => {
    prismaMock.booking.findUnique.mockResolvedValue({
      id: 1,
      userId: 1,
      vehicleId: 1,
    });

    const result = await service.findOne(1);

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  test('should throw NotFoundException when booking does not exist', async () => {
    prismaMock.booking.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(
      'Booking with id 999 not found',
    );
  });

  test('should create a booking', async () => {
    httpMock.get.mockReturnValue(
      of({
        data: {
          id: 1,
          price: 100,
          status: 'AVAILABLE',
        },
      }),
    );

    prismaMock.booking.create.mockResolvedValue({
      id: 1,
      userId: 1,
      vehicleId: 1,
      startDate: new Date('2026-09-20T10:00:00Z'),
      endDate: new Date('2026-09-23T10:00:00Z'),
      totalPrice: 300,
      status: 'PENDING',
    });

    const result = await service.create({
      userId: 1,
      vehicleId: 1,
      startDate: '2026-09-20T10:00:00Z',
      endDate: '2026-09-23T10:00:00Z',
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });
  test('should calculate total price and emit booking event', async () => {
  httpMock.get.mockReturnValue(
    of({
      data: {
        id: 1,
        price: 100,
        status: 'AVAILABLE',
      },
    }),
  );

  prismaMock.booking.create.mockResolvedValue({
    id: 1,
    userId: 1,
    vehicleId: 1,
    startDate: new Date('2026-09-20T10:00:00Z'),
    endDate: new Date('2026-09-23T10:00:00Z'),
    totalPrice: 300,
    status: 'PENDING',
  });

  const result = await service.create({
    userId: 1,
    vehicleId: 1,
    startDate: '2026-09-20T10:00:00Z',
    endDate: '2026-09-23T10:00:00Z',
  });

  expect(result.totalPrice).toBe(300);

  expect(prismaMock.booking.create).toHaveBeenCalledWith({
    data: {
      userId: 1,
      vehicleId: 1,
      startDate: new Date('2026-09-20T10:00:00Z'),
      endDate: new Date('2026-09-23T10:00:00Z'),
      totalPrice: 300,
    },
  });

  expect(kafkaMock.emit).toHaveBeenCalledWith(
    'booking_created',
    {
      bookingId: 1,
      vehicleId: 1,
    },
  );
});
test('should throw BadRequestException when vehicle is not available', async () => {
  httpMock.get.mockReturnValue(
    of({
      data: {
        id: 1,
        price: 100,
        status: 'RESERVED',
      },
    }),
  );

  await expect(
    service.create({
      userId: 1,
      vehicleId: 1,
      startDate: '2026-09-20T10:00:00Z',
      endDate: '2026-09-23T10:00:00Z',
    }),
  ).rejects.toThrow('Vehicle is not available');

  expect(prismaMock.booking.create).not.toHaveBeenCalled();
});
test('should throw BadRequestException when end date is before start date', async () => {
  httpMock.get.mockReturnValue(
    of({
      data: {
        id: 1,
        price: 100,
        status: 'AVAILABLE',
      },
    }),
  );

  await expect(
    service.create({
      userId: 1,
      vehicleId: 1,
      startDate: '2026-09-23T10:00:00Z',
      endDate: '2026-09-20T10:00:00Z',
    }),
  ).rejects.toThrow('End date must be after start date');

  expect(prismaMock.booking.create).not.toHaveBeenCalled();
});
test('should request the correct vehicle', async () => {
  httpMock.get.mockReturnValue(
    of({
      data: {
        id: 5,
        price: 100,
        status: 'AVAILABLE',
      },
    }),
  );

  prismaMock.booking.create.mockResolvedValue({
    id: 1,
    userId: 1,
    vehicleId: 5,
    totalPrice: 300,
    status: 'PENDING',
  });

  await service.create({
    userId: 1,
    vehicleId: 5,
    startDate: '2026-09-20T10:00:00Z',
    endDate: '2026-09-23T10:00:00Z',
  });

  expect(httpMock.get).toHaveBeenCalledWith(
    'http://localhost:3001/vehicles/5',
  );
});
test('should delete a booking and emit cancellation event', async () => {
  prismaMock.booking.findUnique.mockResolvedValue({
    id: 1,
    userId: 1,
    vehicleId: 5,
  });

  prismaMock.booking.delete.mockResolvedValue({
    id: 1,
    userId: 1,
    vehicleId: 5,
  });

  const result = await service.remove(1);

  expect(result.id).toBe(1);

  expect(prismaMock.booking.delete).toHaveBeenCalledWith({
    where: { id: 1 },
  });

  expect(kafkaMock.emit).toHaveBeenCalledWith(
    'booking_cancelled',
    {
      bookingId: 1,
      vehicleId: 5,
    },
  );
});
test('should throw NotFoundException when deleting a non-existing booking', async () => {
  prismaMock.booking.findUnique.mockResolvedValue(null);

  await expect(service.remove(999)).rejects.toThrow(
    'Booking with id 999 not found',
  );

  expect(prismaMock.booking.delete).not.toHaveBeenCalled();
  expect(kafkaMock.emit).not.toHaveBeenCalled();
});
test('should call findUnique with correct id', async () => {
  prismaMock.booking.findUnique.mockResolvedValue({
    id: 10,
    userId: 2,
    vehicleId: 5,
  });

  await service.findOne(10);

  expect(prismaMock.booking.findUnique).toHaveBeenCalledWith({
    where: { id: 10 },
  });
});
});
