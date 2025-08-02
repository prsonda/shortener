import { InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ShortenerRepository } from '../shortener.repositoy';
import { ShortCodeGeneratorService } from './short-code-generator.service';

jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));

describe('ShortCodeGeneratorService', () => {
  let service: ShortCodeGeneratorService;
  let repo: jest.Mocked<ShortenerRepository>;

  const BASE62 =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  beforeEach(() => {
    repo = {
      findByShortCode: jest.fn(),
    } as any;

    service = new ShortCodeGeneratorService(repo);
  });

  it('should generate a unique 6-char code and return it', async () => {
    (randomBytes as jest.Mock).mockReturnValue(Buffer.from([1, 2, 3, 4, 5, 6]));
    repo.findByShortCode.mockResolvedValue(null);

    const code = await service.generateUniqueShortCode(6);

    expect(code).toHaveLength(6);
    for (const c of code) {
      expect(BASE62).toContain(c);
    }
    expect(repo.findByShortCode).toHaveBeenCalledWith(code);
  });

  it('should retry generating code if duplicate found and succeed', async () => {
    // First call returns a duplicate, second call returns unique
    repo.findByShortCode
      .mockResolvedValueOnce({ id: 'exists' } as any)
      .mockResolvedValueOnce(null);

    (randomBytes as jest.Mock)
      .mockReturnValueOnce(Buffer.from([0, 1, 2, 3, 4, 5]))
      .mockReturnValueOnce(Buffer.from([23, 24, 25, 7, 8, 9]));

    const code = await service.generateUniqueShortCode(6);

    expect(repo.findByShortCode).toHaveBeenCalledTimes(2);
    expect(code).toHaveLength(6);
  });

  it('should throw InternalServerErrorException after 10 failed attempts', async () => {
    repo.findByShortCode.mockResolvedValue({ id: 'exists' } as any);
    (randomBytes as jest.Mock).mockReturnValue(Buffer.from([0, 1, 2, 3, 4, 5]));

    await expect(service.generateUniqueShortCode(6)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(repo.findByShortCode).toHaveBeenCalledTimes(11);
  });
});
