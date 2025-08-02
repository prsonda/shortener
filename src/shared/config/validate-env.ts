import { ErrorMessages } from '@/shared/constants/messages';
import { InternalServerErrorException } from '@nestjs/common';
import {
  BASE_URL,
  DATABASE_URL,
  JWT_EXPIRES_IN,
  JWT_SECRET,
} from './env.provider';

export function validateEnv(): void {
  if (!BASE_URL) {
    throw new InternalServerErrorException(ErrorMessages.baseUrlNotDefined);
  }
  if (!DATABASE_URL) {
    throw new InternalServerErrorException(ErrorMessages.dbUrlNotDefined);
  }
  if (!JWT_SECRET) {
    throw new InternalServerErrorException(ErrorMessages.sicretJwtNotDefined);
  }
  if (!JWT_EXPIRES_IN) {
    throw new InternalServerErrorException(ErrorMessages.expiresJwtNotDefined);
  }
}
