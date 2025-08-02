import { JwtAuthGuard } from '@/modules/auth/infrastructure/jwt.guard';
import { OptionalJwtAuthGuard } from '@/modules/auth/infrastructure/optional-jwt-auth.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerService } from '../application/shortener.service';
import { ShortenerController } from './shortener.controller';

describe('ShortenerController', () => {
  let controller: ShortenerController;

  const mockShortCode = 'abc123';
  const mockUserId = 'e913de7a-1221-4db8-84d6-d7a236d192ac';

  const mockCreate = {
    originalUrl: 'https://www.exemplo.com/br/test/ulr-large/',
  };

  const mockUpdate = mockCreate;

  const mockQuery = {
    page: 1,
    limit: 10,
  };

  const mockResponseItem = {
    id: 'e913de7a-1331-4db8-91d6-d7a236d192ac',
    userId: mockUserId,
    originalUrl: mockCreate.originalUrl,
    shortCode: mockShortCode,
    clicks: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockService = {
    create: jest.fn(),
    findByShortCode: jest.fn(),
    findByUser: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = (userId = mockUserId) => ({ user: { userId } }) as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenerController],
      providers: [
        {
          provide: ShortenerService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(OptionalJwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ShortenerController>(ShortenerController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma URL encurtada', async () => {
      mockService.create.mockResolvedValue(mockResponseItem);

      const body = { originalUrl: mockResponseItem.originalUrl };
      const result = await controller.create(mockRequest(), body);

      expect(result).toEqual(mockResponseItem);
      expect(mockService.create).toHaveBeenCalledWith(body, mockUserId);
    });
  });

  describe('findByCode', () => {
    it('deve retornar uma URL por shortCode', async () => {
      mockService.findByShortCode.mockResolvedValue(mockResponseItem);

      const result = await controller.findByCode(mockRequest(), mockShortCode);

      expect(result).toEqual(mockResponseItem);
      expect(mockService.findByShortCode).toHaveBeenCalledWith(
        mockShortCode,
        mockUserId,
      );
    });
  });

  describe('findByUser', () => {
    it('deve retornar todas as URLs do usuário', async () => {
      mockService.findByUser.mockResolvedValue([mockResponseItem]);

      const result = await controller.findByUser(mockRequest(), mockQuery);

      expect(result).toEqual([mockResponseItem]);
      expect(mockService.findByUser).toHaveBeenCalledWith(
        mockUserId,
        mockQuery,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar uma URL encurtada', async () => {
      const updatedItem = { ...mockResponseItem, ...mockUpdate };

      mockService.update.mockResolvedValue(updatedItem);

      const result = await controller.update(
        mockShortCode,
        mockUpdate,
        mockRequest(),
      );

      expect(result).toEqual(updatedItem);
      expect(mockService.update).toHaveBeenCalledWith(
        mockUserId,
        mockShortCode,
        mockUpdate,
      );
    });
  });

  describe('remove', () => {
    it('deve deletar logicamente uma URL encurtada', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockRequest(), mockShortCode);

      expect(result).toBeUndefined();
      expect(mockService.remove).toHaveBeenCalledWith(
        mockUserId,
        mockShortCode,
      );
    });
  });
});
