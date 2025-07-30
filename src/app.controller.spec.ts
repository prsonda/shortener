import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: Partial<AppService>;

  beforeEach(async () => {
    appService = {
      getVersion: jest.fn().mockReturnValue({ version: '0.1.0' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appService,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('getVersion', () => {
    it('should return current API version', () => {
      const result = appController.getVersion();

      expect(result).toEqual({ version: '0.1.0' });
      expect(appService.getVersion).toHaveBeenCalled();
    });
  });
});
