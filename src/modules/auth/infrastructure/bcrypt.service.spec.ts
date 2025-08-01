import * as bcrypt from 'bcrypt';
import { BcryptService } from './bcrypt.service';

jest.mock('bcrypt');

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(() => {
    service = new BcryptService();
  });

  const mockPassword = 'Jmc@459f2';
  const mockHashed = 'hashedPassword';

  it('should hash a password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashed);

    const result = await service.hash(mockPassword);

    expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
    expect(result).toBe(mockHashed);
  });

  it('should compare password with hash', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.compare(mockPassword, mockHashed);

    expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashed);
    expect(result).toBe(true);
  });
});
