import { ErrorMessages } from '@/shared/constants/messages';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';
import request from 'supertest';
import { ShortenerService } from '../application/shortener.service';
import { ShortenerRedirectController } from './shortener-redirect.controller';

const mockShortCode = 'abc123';
const mockUserId = 'e913de7a-1221-4db8-84d6-d7a236d192ac';
const mockResponseItem = {
  id: 'e913de7a-1331-4db8-91d6-d7a236d192ac',
  userId: mockUserId,
  originalUrl: 'https://www.exemplo.com/br/test/ulr-large/',
  shortCode: mockShortCode,
  clicks: 0,
  createdAt: DateTime.now().toJSDate(),
  updatedAt: DateTime.now().toJSDate(),
  deletedAt: null,
};

describe('ShortenerRedirectController', () => {
  let app: INestApplication;
  const mockShortenerService = {
    findByShortCode: jest.fn(),
    incrementClicks: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenerRedirectController],
      providers: [
        {
          provide: ShortenerService,
          useValue: mockShortenerService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve redirecionar quando shortCode é válido', async () => {
    mockShortenerService.findByShortCode.mockResolvedValue(mockResponseItem);

    await request(app.getHttpServer())
      .get(`/${mockShortCode}`)
      .expect(302)
      .expect('Location', mockResponseItem.originalUrl);

    expect(mockShortenerService.findByShortCode).toHaveBeenCalledWith(
      mockShortCode,
    );
    expect(mockShortenerService.incrementClicks).toHaveBeenCalledWith(
      mockShortCode,
    );
  });

  it('deve retornar 404 se shortCode não for encontrado', async () => {
    mockShortenerService.findByShortCode.mockResolvedValue(null);

    await request(app.getHttpServer())
      .get(`/naoexiste`)
      .expect(404)
      .expect(ErrorMessages.notFound);

    expect(mockShortenerService.findByShortCode).toHaveBeenCalledWith(
      'naoexiste',
    );
    expect(mockShortenerService.incrementClicks).not.toHaveBeenCalled();
  });
});
