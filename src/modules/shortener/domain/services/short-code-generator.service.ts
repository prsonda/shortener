import { ErrorMessages } from '@/shared/constants/messages';
import { InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ShortenerRepository } from '../shortener.repositoy';

export class ShortCodeGeneratorService {
  constructor(private readonly shortenerRepository: ShortenerRepository) {}

  async generateUniqueShortCode(length = 6): Promise<string> {
    let attempts = 0;
    const BASE62 =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    do {
      let code = '';
      const bytes = randomBytes(length);

      for (let i = 0; i < length; i++) {
        code += BASE62[bytes[i] % BASE62.length];
      }
      const exists = await this.shortenerRepository.findByShortCode(code);
      if (!exists) return code;

      attempts++;
      if (attempts > 10)
        throw new InternalServerErrorException(
          ErrorMessages.generateCodeFailed,
        );
    } while (true);
  }
}
